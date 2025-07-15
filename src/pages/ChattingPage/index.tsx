import ChatbotSystemMessage from '@/features/chatbot/components/ChatbotSystemMessage';
import useChat from '@/features/chatbot/hooks/useChat';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from 'react-router-dom';

// location.state 타입 정의

const ChattingPage = () => {
  const navigate = useNavigate();
  const {
    mode,
    messages,
    inputMessage,
    isLoading,
    messagesEndRef,
    onChange,
    handleSendMessage,
    handleKeyPress,
  } = useChat();

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
