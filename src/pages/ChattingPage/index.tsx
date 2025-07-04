import ChatbotSystemMessage from '@/features/chatbot/components/ChatbotSystemMessage';
import useInput from '@/shared/hooks/useInput';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const tempMessages = [
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
  const [messages, setMessages] = useState(tempMessages);
  const { value: inputMessage, onChange, reset } = useInput();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mode = useLocation().state?.mode;
  const code = useLocation().state?.code;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지를 전송합니다
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    reset();
    setIsLoading(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: '답변을 생성하고 있습니다...',
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = e => {
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
          <PageHeader title={mode} />
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
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs break-words">
                <p className="text-sm whitespace-pre-line font-mono">{message.content}</p>
              </div>
            )}

            {message.type === 'bot' && (
              <div className="rounded-lg p-3 max-w-xs text-black">
                <p className="text-sm text-black">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
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
