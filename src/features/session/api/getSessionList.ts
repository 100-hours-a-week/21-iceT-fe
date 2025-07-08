import { API_SUB_URLS_V2 } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';
import { IApiResponse } from '@/shared/types/ApiResponse';
import { ChatSession } from '../types/chatSession';

interface IGetSessionListRequest {
  cursorId: number | null;
}

interface IGetSessionListResponse {
  nextCursorId: number;
  hasNext: boolean;
  chatSessions: ChatSession[];
}

const getSessionList = async ({ cursorId }: IGetSessionListRequest) => {
  const response = await axiosInstance.get<IApiResponse<IGetSessionListResponse>>(
    `${API_SUB_URLS_V2}/chat/history`,
    { params: { cursorId } }
  );

  return response.data.data;
};

export default getSessionList;
