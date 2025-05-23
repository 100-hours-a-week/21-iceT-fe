import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getPresignedUrl } from '@/apis/imageApi';

/**
 * 사용자 프로필 업로드를 위한 presigned url 요청
 */
export const useGetPresignedUrl = (fileName: string) => {
  return useQuery({
    queryKey: queryKeys.users.presignedUrl,
    queryFn: () => getPresignedUrl(fileName),
    staleTime: 1000 * 60 * 5,
    enabled: !!fileName,
  });
};
