import { useMutation } from '@tanstack/react-query';
import sendMessage, { ISendMessageRequest } from '../api/sendMessage';

const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: ISendMessageRequest) => sendMessage(data),
  });
};

export default useSendMessage;
