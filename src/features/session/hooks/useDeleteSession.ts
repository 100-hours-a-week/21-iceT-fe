import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteSession from '../api/deleteSession';

const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionIds: string) => deleteSession(sessionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export default useDeleteSession;
