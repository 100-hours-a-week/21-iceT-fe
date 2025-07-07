import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';

export interface ISendMessageRequest {
  sessionId: number;
  content: string;
}

/**
 *  사용자에게 메시지를 전송하는 api
 * @param data (sessionId, content)
 * @returns
 */
const sendMessage = async (data: ISendMessageRequest) => {
  const response = await axiosInstance.post(
    `${API_SUB_URLS_V2}/chat/session/${data.sessionId}/followup`,
    {
      content: data.content,
    }
  );

  return response.data.data;
};

export default sendMessage;
