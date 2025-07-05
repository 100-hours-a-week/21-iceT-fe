import { API_BASE_URL, API_SUB_URLS_V2 } from '@/constants/apiConfig';
import ChatbotSystemMessage from '@/features/chatbot/components/ChatbotSystemMessage';
import useInput from '@/shared/hooks/useInput';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import MDEditor from '@uiw/react-md-editor';

// 메시지 타입 정의
interface IMessage {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: string;
}

// location.state 타입 정의
interface ILocationState {
  mode?: string;
  code?: string;
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
  const { mode, code } = (location.state as ILocationState) || {};

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
        type: 'bot',
        content: '',
      };

      setMessages(prev => [...prev, botMessage]);

      // 첫 응답을 위한 API 호출 (POST 요청)
      const response = await fetch(
        `${API_BASE_URL}${API_SUB_URLS_V2}/chat/session/${sessionId}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      // 응답이 SSE인지 확인
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
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
                continue;
              }
              if (line.startsWith('data:')) {
                const data = line.substring(5).trim();
                if (data) {
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === botMessageId ? { ...msg, content: msg.content + data } : msg
                    )
                  );
                }
              }
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
          type: 'bot',
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
        type: 'bot',
        content: '',
      };

      setMessages(prev => [...prev, botMessage]);

      // /followup API 호출 (POST 요청)
      const response = await fetch(
        `${API_BASE_URL}${API_SUB_URLS_V2}/chat/session/${sessionId}/followup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

      // 응답이 SSE인지 확인
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
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

            for (const line of lines) {
              if (line.startsWith('event:message')) {
                continue; // event 타입 확인
              }
              if (line.startsWith('data:')) {
                const data = line.substring(5);
                if (data.trim() && data !== '[DONE]') {
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === botMessageId ? { ...msg, content: msg.content + data } : msg
                    )
                  );
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle followup streaming:', error);
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 세션 시작
  useEffect(() => {
    const startSession = async () => {
      if (id && !isSessionInitialized) {
        try {
          // sessionId를 number로 변환하고 유효성 검사
          const sessionId = Number(id);
          if (isNaN(sessionId)) {
            console.error('Invalid sessionId: must be a number');

            return;
          }

          // 세션 시작 및 스트리밍 처리
          await handleStartSessionStreaming(sessionId, code);
          setIsSessionInitialized(true);
        } catch (error) {
          console.error('Failed to start session:', error);
        }
      } else if (!id) {
        alert('잘못된 경로입니다');
        navigate('/new-chat');
      }
    };

    startSession();
  }, [id, code, isSessionInitialized]);

  // 메시지 전송
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

    // followup 스트리밍 응답 처리
    await handleFollowupStreaming(messageToSend, sessionIdNumber);
  };

  // 컴포넌트 언마운트 시 EventSource 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

            {message.type === 'bot' && (
              <div className="max-w-4xl w-full">
                <div data-color-mode="light">
                  <MDEditor.Markdown
                    source={message.content.replace(/^"|"$/g, '') || ''}
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
        <div className="flex items-end gap-3">
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
            className={`p-3 rounded-full transition-colors ${
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
