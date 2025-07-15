import { IMessage } from '@/features/comment/types/message';
import useGetSessionHistory from '@/features/session/hooks/useGetSessionHistory';
import useInput from '@/shared/hooks/useInput';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchStreamWithAuth } from '../utils/fetchStreamWithAuth';
import { API_BASE_URL, API_SUB_URLS_V2 } from '@/constants/apiConfig';
import { handleSSEStream } from '../utils/handleSSEstream';
import { SessionHistoryData } from '@/features/comment/types/session';

interface ILocationState {
  mode?: string;
  code?: string;
  session?: boolean;
}

const useChat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { value: inputMessage, onChange, reset } = useInput();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageIdCounter = useRef(0);

  // URL 파라미터와 location state 가져오기
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const { mode, code, session } = (location.state as ILocationState) || {};
  const sessionId = Number(id);
  const shouldFetch = Boolean(session && !isNaN(sessionId));
  const { data: sessionHistoryList } = useGetSessionHistory(sessionId, shouldFetch);

  // 고유 ID 생성 함수
  const generateMessageId = () => {
    messageIdCounter.current += 1;

    return Date.now() + messageIdCounter.current;
  };

  // 스크롤 관리
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 세션 시작 스트리밍 처리
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

      // SSE 응답 처리
      handleSSEStream({ response, botMessageId, setMessages, setIsLoading });
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

  // followup 메시지 스트리밍 처리
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
      handleSSEStream({ response, botMessageId, setMessages, setIsLoading });
    } catch (error) {
      console.error('Failed to handle followup streaming:', error);
      setIsLoading(false);
    }
  };

  // 세션 히스토리를 IMessage 배열로 변환하는 함수
  const convertHistoryToMessages = (historyData: SessionHistoryData): IMessage[] => {
    if (!historyData || !historyData.records || historyData.records.length === 0) {
      return [];
    }

    return historyData.records.map(record => ({
      id: generateMessageId(),
      type: record.role,
      content: record.role === 'assistant' ? record.content.replace(/\\n/g, '\n') : record.content,
    }));
  };

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

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 채팅 초기화
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
          console.log('Waiting for session history data...');
        } else {
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

  // 세션 히스토리 로드
  useEffect(() => {
    if (session && sessionHistoryList && !isSessionInitialized) {
      console.log('Loading session history:', sessionHistoryList);

      const historyMessages = convertHistoryToMessages(sessionHistoryList);

      if (historyMessages.length > 0) {
        setMessages(historyMessages);
        console.log('Session history loaded:', historyMessages);
      } else {
        setMessages([]);
        console.log('No history records found');
      }

      setIsSessionInitialized(true);
    }
  }, [session, sessionHistoryList, isSessionInitialized]);

  return {
    // 상태
    messages,
    inputMessage,
    isLoading,
    isSessionInitialized,
    messagesEndRef,
    mode,

    // 핸들러
    onChange,
    handleSendMessage,
    handleKeyPress,

    // 유틸리티
    scrollToBottom,
  };
};

export default useChat;
