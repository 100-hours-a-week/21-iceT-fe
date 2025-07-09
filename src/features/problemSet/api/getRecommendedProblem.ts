import { API_SUB_URLS } from '@/constants/apiConfig';
import axiosInstance from '@/shared/lib/axios';
import { IApiResponse } from '@/shared/types/ApiResponse';

type Problem = {
  problemId: number;
  problemNumber: number;
  title: string;
  tier: string;
  bojUrl: string;
};

interface IGetRecommendedProblemResponse {
  date: string;
  problems: Problem[];
}

const getRecommendedProblem = async (date: string) => {
  const response = await axiosInstance.get<IApiResponse<IGetRecommendedProblemResponse>>(
    `${API_SUB_URLS}/problems/recommended?date=${date}`
  );

  return response.data.data;
};

export default getRecommendedProblem;
