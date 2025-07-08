import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';

/**
 * 채팅 세션을 삭제하는 API
 * @param sessionIds (ex. "7, 8, 9")
 * @returns
 */
const deleteSession = async (sessionIds: string) => {
  console.log(sessionIds);
  const response = await axiosInstance.delete(`${API_SUB_URLS_V2}/chat/session/delete`, {
    headers: {
      'Session-Ids': sessionIds,
    },
  });

  return response.data.data;
};

export default deleteSession;
