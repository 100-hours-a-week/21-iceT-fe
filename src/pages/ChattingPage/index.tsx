import { API_BASE_URL, API_SUB_URLS, API_SUB_URLS_V2 } from '@/constants/apiConfig';
import ChatbotSystemMessage from '@/features/chatbot/components/ChatbotSystemMessage';
import useInput from '@/shared/hooks/useInput';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import useGetSessionHistory from '@/features/session/hooks/useGetSessionHistory';

// 메시지 타입 정의
interface IMessage {
  id: number;
  type: string;
  content: string;
}

// 세션 히스토리 데이터 타입 정의
type SessionHistoryRecord = {
  role: string;
  content: string;
  createdAt: string;
};

type SessionHistoryData = {
  sessionId: string;
  title: string;
  date: string;
  type: string;
  records: SessionHistoryRecord[];
};
// location.state 타입 정의
interface ILocationState {
  mode?: string;
  code?: string;
  session?: boolean;
}

const ChattingPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { value: inputMessage, onChange, reset } = useInput();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageIdCounter = useRef(0); // 고유 ID 생성용

  // URL 파라미터와 location state 가져오기
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const { mode, code, session } = (location.state as ILocationState) || {};
  const sessionId = Number(id); // id는 useParams로부터 항상 있음
  const shouldFetch = Boolean(session && !isNaN(sessionId));
  const { data: sessionHistoryList } = useGetSessionHistory(sessionId, shouldFetch);

  // 고유 ID 생성 함수
  const generateMessageId = () => {
    messageIdCounter.current += 1;

    return Date.now() + messageIdCounter.current;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 세션 시작 시 SSE 스트리밍 처리
  const handleStartSessionStreaming = async (sessionId: number, initialCode?: string) => {
    try {
      setIsLoading(true);

      if (!initialCode) {
        alert('잘못된 경로입니다');
        navigate('/new-chat');

        return;
      }
      const initialMessage: IMessage = {
        id: generateMessageId(),
        type: 'user',
        content: initialCode,
      };
      setMessages([initialMessage]);

      // 봇 메시지 추가 (스트리밍용)
      const botMessageId = generateMessageId();
      const botMessage: IMessage = {
        id: botMessageId,
        type: 'assistant',
        content: '',
      };

      setMessages(prev => [...prev, botMessage]);

      const response = await fetchStreamWithAuth(
        `${API_BASE_URL}${API_SUB_URLS_V2}/chat/session/${sessionId}/start`,
        {
          method: 'POST',
          headers: {
            Accept: 'text/event-stream',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      // SSE 응답 처리 - 응답 본문에서 스트리밍 URL 추출하거나 직접 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsLoading(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('event:message')) {
              continue; // event 타입 확인
            }
            if (line.startsWith('data:')) {
              let data = line.substring(5);
              if (data === '\\n') {
                data = '  \n'; // 마크다운 줄바꿈
              }

              // 모든 데이터(공백 포함) 추가
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botMessageId ? { ...msg, content: msg.content + data } : msg
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle start session streaming:', error);
      setIsLoading(false);

      // 에러 메시지 표시
      const errorBotMessageId = generateMessageId();
      setMessages(prev => [
        ...prev,
        {
          id: errorBotMessageId,
          type: 'system',
          content: '세션 시작 중 오류가 발생했습니다.',
        },
      ]);
    }
  };

  // followup 메시지 SSE 스트리밍 처리
  const handleFollowupStreaming = async (userMessage: string, sessionId: number) => {
    try {
      setIsLoading(true);

      // 봇 메시지 추가 (스트리밍용)
      const botMessageId = generateMessageId();
      const botMessage: IMessage = {
        id: botMessageId,
        type: 'assistant',
        content: '',
      };

      setMessages(prev => [...prev, botMessage]);

      // /followup API 호출 (POST 요청)
      const response = await fetchStreamWithAuth(
        `${API_BASE_URL}${API_SUB_URLS_V2}/chat/session/${sessionId}/followup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          credentials: 'include',
          body: JSON.stringify({
            content: userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send followup message');
      }

      // SSE 응답 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setIsLoading(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          console.log(lines);

          for (const line of lines) {
            if (line.startsWith('event:message')) {
              continue; // event 타입 확인
            }
            if (line.startsWith('data:')) {
              let data = line.substring(5);
              if (data === '\\n') {
                data = '  \n'; // 마크다운 줄바꿈
              }

              // 모든 데이터(공백 포함) 추가
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botMessageId ? { ...msg, content: msg.content + data } : msg
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle followup streaming:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (!id || isSessionInitialized) return;

      const sessionId = Number(id);
      if (isNaN(sessionId)) {
        console.error('Invalid sessionId: must be a number');
        navigate('/new-chat');

        return;
      }

      try {
        if (session) {
          // 세션 히스토리에서 온 경우 - 히스토리 데이터 로드 대기
          // sessionHistoryList 데이터가 로드될 때까지 기다림
          console.log('Waiting for session history data...');
        } else {
          // 새로운 세션 시작
          if (!code) {
            alert('잘못된 경로입니다');
            navigate('/new-chat');

            return;
          }
          await handleStartSessionStreaming(sessionId, code);
          setIsSessionInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        navigate('/new-chat');
      }
    };

    initializeChat();
  }, [id, session, isSessionInitialized, code]);

  // 세션 히스토리 데이터가 로드되면 메시지로 변환
  useEffect(() => {
    if (session && sessionHistoryList && !isSessionInitialized) {
      console.log('Loading session history:', sessionHistoryList);

      // 히스토리 데이터를 메시지로 변환
      const historyMessages = convertHistoryToMessages(sessionHistoryList);

      if (historyMessages.length > 0) {
        setMessages(historyMessages);
        console.log('Session history loaded:', historyMessages);
      } else {
        // 히스토리가 비어있는 경우
        setMessages([]);
        console.log('No history records found');
      }

      setIsSessionInitialized(true);
    }
  }, [session, sessionHistoryList, isSessionInitialized]);

  // 메시지 전송 함수 수정 (세션 히스토리 모드에서도 새 메시지 전송 가능)
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 이미 로딩 중이면 중복 요청 방지
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 사용자 메시지 추가
    const newMessage: IMessage = {
      id: generateMessageId(),
      type: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = inputMessage;
    reset();

    // sessionId 가져오기
    if (!id) return;
    const sessionIdNumber = Number(id);
    if (isNaN(sessionIdNumber)) return;

    // followup 스트리밍 응답 처리 (세션 히스토리 모드에서도 동일)
    await handleFollowupStreaming(messageToSend, sessionIdNumber);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_SUB_URLS}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        return true;
      } else {
        // 리프레시 실패 시 로그인 페이지로 리다이렉트
        navigate('/');

        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      navigate('/');

      return false;
    }
  };

  // 스트리밍 응답 처리를 위한 401 에러 핸들링 함수
  const fetchStreamWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        // 토큰 리프레시 시도
        const refreshSuccess = await refreshToken();

        if (refreshSuccess) {
          // 리프레시 성공 시 원래 요청 재시도
          return await fetch(url, options);
        } else {
          // 리프레시 실패 시 에러 throw
          throw new Error('Authentication failed');
        }
      }

      return response;
    } catch (error) {
      console.error('Fetch with auth failed:', error);
      throw error;
    }
  };

  // 세션 히스토리를 IMessage 배열로 변환하는 함수
  const convertHistoryToMessages = (historyData: SessionHistoryData): IMessage[] => {
    if (!historyData || !historyData.records || historyData.records.length === 0) {
      return [];
    }

    return historyData.records.map(record => ({
      id: generateMessageId(),
      type: record.role, // 'user' 또는 'assistant' 그대로 사용
      content: record.content,
    }));
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <PageHeader title={mode || '채팅'} />
          <button
            onClick={() => navigate('/chat-sessions')}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors px-4"
          >
            과거 대화 이력 보기
          </button>
        </div>
      </div>

      {/* 채팅 영역 - 스크롤 가능 */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        <ChatbotSystemMessage mode={mode as string} />
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'system' && (
              <div className="bg-white rounded-lg p-4 max-w-xs shadow-sm border">
                <p className="text-sm text-gray-700 whitespace-pre-line">{message.content}</p>
              </div>
            )}

            {message.type === 'user' && (
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-2xl break-words">
                <p className="text-sm whitespace-pre-wrap font-mono">{message.content}</p>
              </div>
            )}

            {message.type === 'assistant' && (
              <div className="max-w-4xl w-full">
                <div data-color-mode="light">
                  <MDEditor.Markdown
                    source={message.content}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '14px',
                      lineHeight: '2.5',
                    }}
                    className="!bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start max-w-4xl w-full">
            <div className="flex items-center gap-2 text-gray-600 py-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span className="text-sm">응답 생성 중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 - 고정 */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={onChange}
              onKeyPress={handleKeyPress}
              placeholder="무엇이든 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-full transition-colors  ${
              inputMessage.trim() && !isLoading
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default ChattingPage;
