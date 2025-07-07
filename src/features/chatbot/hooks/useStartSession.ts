import { useMutation } from '@tanstack/react-query';
import startSession from '../api/startSession';

const useStartSession = () => {
  return useMutation({
    mutationFn: (sessionId: number) => startSession(sessionId),
  });
};
export default useStartSession;
