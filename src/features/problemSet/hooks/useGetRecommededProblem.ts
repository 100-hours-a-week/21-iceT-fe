import { queryKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import getRecommendedProblem from '../api/getRecommendedProblem';

const useGetRecommendedProblem = (date: string) => {
  return useQuery({
    queryKey: queryKeys.problems.aiRecommended(date),
    queryFn: () => getRecommendedProblem(date),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 3,
    enabled: !!date,
  });
};

export default useGetRecommendedProblem;
