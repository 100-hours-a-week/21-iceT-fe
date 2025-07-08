import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';
import { IApiResponse } from '@/shared/types/ApiResponse';

interface IGetSessionHistoryResponse {
  sessionId: string;
  title: string;
  date: string;
  type: string;
  records: Records[];
}
export type Records = {
  role: string;
  content: string;
  createdAt: string;
};

const getSessionHistory = async (sessionId: number) => {
  const response = await axiosInstance.get<IApiResponse<IGetSessionHistoryResponse>>(
    `${API_SUB_URLS_V2}/chat/history/${sessionId}`
  );

  return response.data.data;
};

export default getSessionHistory;
