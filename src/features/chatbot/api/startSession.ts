import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';

/***
 * 채팅방 세션 시작 api 호출
 */
const startSession = async (sessionId: number) => {
  const response = await axiosInstance.post(`${API_SUB_URLS_V2}/chat/session/${sessionId}/start`);

  return response.data.data;
};

export default startSession;
