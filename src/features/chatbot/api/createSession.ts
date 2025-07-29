import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';

export interface ICreateSessionRequest {
  problemNumber: number;
  language: string;
  mode: string; // feedback 또는 interview,
  userCode: string;
}

/**
 * 챗봇 채팅방 입장 전 세션을 생성하는 api입니다.
 * @param data
 * @returns
 */
const createSession = async (data: ICreateSessionRequest) => {
  const response = await axiosInstance.post(`${API_SUB_URLS_V2}/chat/init`, data);

  return response.data.data;
};

export default createSession;
