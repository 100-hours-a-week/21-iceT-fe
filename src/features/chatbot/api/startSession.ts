import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';

export interface IStartSessionRequest {
  problemNumber: number;
  language: string;
  mode: string; // feedback 또는 interview,
  userCode: string;
}

const startSession = async (data: IStartSessionRequest) => {
  const response = await axiosInstance.post(`${API_SUB_URLS_V2}/chat/init`, data);

  return response.data.data;
};

export default startSession;
