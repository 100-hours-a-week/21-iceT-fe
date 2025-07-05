import ChatbotSystemMessage from '@/features/chatbot/components/ChatbotSystemMessage';
import useSendMessage from '@/features/chatbot/hooks/useSendMessage';
import useStartSession from '@/features/chatbot/hooks/useStartSession';
import useInput from '@/shared/hooks/useInput';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

const tempMessages: IMessage[] = [
  {
    id: 2,
    type: 'user',
    content: `#include <iostream>
using namespace std;

int main(void) {
    ios::sync_with_stdio(false); cin.tie(0);
    cout.tie(0);
    
    long long s, cin >> s;
    long long sum = 0;
    int i = 1;
    
    while (sum < s) {`,
  },
  {
    id: 4,
    type: 'user',
    content: '이 코드에서 def ~~~ 의 결과 보완할 다음에 같이 고치는게 좋아',
  },
  {
    id: 5,
    type: 'user',
    content: 'def main :',
  },
  {
    id: 6,
    type: 'bot',
    content: '네가 작성한 코드를 수정하여 완성해 보겠습니다',
  },
];

const ChattingPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { value: inputMessage, onChange, reset } = useInput();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // URL 파라미터와 location state 가져오기
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const { mode, code } = (location.state as ILocationState) || {};

  const startSessionMutation = useStartSession();
  const sendMessageMutation = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 페이지 로드 시 세션 초기화
  useEffect(() => {
    const initializeSession = async () => {
      if (id && !isSessionInitialized) {
        try {
          // sessionId를 number로 변환하고 유효성 검사
          const sessionId = Number(id);
          if (isNaN(sessionId)) {
            console.error('Invalid sessionId: must be a number');

            return;
          }

          // location.state.code가 있으면 첫 메시지로 설정
          if (code) {
            const initialMessage: IMessage = {
              id: 1,
              type: 'user',
              content: code,
            };
            setMessages([initialMessage]);
          } else {
            // code가 없으면 기본 메시지들 사용
            setMessages(tempMessages);
          }

          // 세션 시작 API 호출
          await startSessionMutation.mutateAsync(sessionId);
          setIsSessionInitialized(true);
        } catch (error) {
          console.error('Failed to initialize session:', error);
        }
      } else if (!id) {
        // sessionId가 없으면 기본 메시지들 사용
        alert('잘못된 경로입니다');
        navigate('/new-chat');
      }
    };

    initializeSession();
  }, [id, code, isSessionInitialized, startSessionMutation]);

  // 메시지 전송 API 호출 함수
  const sendMessageToAPI = async (content: string, sessionId: number) => {
    try {
      await sendMessageMutation.mutate({ content, sessionId });
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // 스트리밍 응답 처리 함수
  const handleStreamingResponse = async (userMessage: string) => {
    if (!id) return;

    const sessionIdNumber = Number(id);
    if (isNaN(sessionIdNumber)) return;

    try {
      setIsLoading(true);

      // 메시지 전송 API 호출
      await sendMessageToAPI(userMessage, sessionIdNumber);

      // 스트리밍 응답 받기
      const eventSource = new EventSource(
        `http://localhost:8080/api/backend/v2/chat/session/${sessionIdNumber}/stream`
      );

      eventSourceRef.current = eventSource;
      setStreamingMessage('');

      // 봇 메시지 추가 (스트리밍용)
      const botMessageId = Date.now();
      const botMessage: IMessage = {
        id: botMessageId,
        type: 'bot',
        content: '',
      };

      setMessages(prev => [...prev, botMessage]);

      eventSource.onmessage = event => {
        const data = event.data;

        if (data === '[DONE]') {
          eventSource.close();
          setIsLoading(false);
          setStreamingMessage('');

          return;
        }

        // 실시간으로 봇 메시지 업데이트
        setMessages(prev =>
          prev.map(msg => (msg.id === botMessageId ? { ...msg, content: msg.content + data } : msg))
        );
      };

      eventSource.onerror = error => {
        console.error('EventSource error:', error);
        eventSource.close();
        setIsLoading(false);
        setStreamingMessage('');

        // 에러 메시지 표시
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: '응답을 받는 중 오류가 발생했습니다.' }
              : msg
          )
        );
      };
    } catch (error) {
      console.error('Failed to handle streaming response:', error);
      setIsLoading(false);

      // 에러 메시지 추가
      const errorMessage: IMessage = {
        id: Date.now(),
        type: 'bot',
        content: '메시지 전송에 실패했습니다.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // 메시지를 전송합니다 (무한 호출 방지)
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 이미 로딩 중이면 중복 요청 방지
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const newMessage: IMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = inputMessage;
    reset();

    // 스트리밍 응답 처리
    await handleStreamingResponse(messageToSend);
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
        <ChatbotSystemMessage mode={mode} />
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
              <div className="bg-gray-100 border rounded-lg p-3 max-w-2xl text-black">
                <p className="text-sm text-black whitespace-pre-wrap">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border rounded-lg p-3 max-w-xs">
              <div className="flex items-center gap-2 text-gray-600">
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
