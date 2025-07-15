import { IMessage } from '@/features/comment/types/message';

interface IHandleSseStreamProps {
  response: Response;
  botMessageId: number;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleSSEStream = async ({
  response,
  botMessageId,
  setMessages,
  setIsLoading,
}: IHandleSseStreamProps) => {
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
};
