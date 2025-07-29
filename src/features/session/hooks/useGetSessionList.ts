import { useInfiniteQuery } from '@tanstack/react-query';
import getSessionList from '../api/getSessionList';

const useGetSessionList = () => {
  return useInfiniteQuery({
    queryKey: ['sessions'],
    queryFn: ({ pageParam }) => getSessionList({ cursorId: pageParam }),
    initialPageParam: null as number | null,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.nextCursorId : undefined;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

export default useGetSessionList;
