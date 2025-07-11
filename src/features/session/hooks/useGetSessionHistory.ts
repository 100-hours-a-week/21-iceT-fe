import { useQuery } from '@tanstack/react-query';
import getSessionHistory from '../api/getSessionHistory';

/**
 * 대화 이력 조회에서 채팅방으로 이동할 때 history를 얻기 위한 훅
 * @param sessionId
 * @returns
 */
const useGetSessionHistory = (sessionId: number, session: boolean) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSessionHistory(sessionId),
    staleTime: 0,
    gcTime: 0,
    enabled: session && !!sessionId,
    refetchOnMount: true,
  });
};

export default useGetSessionHistory;
