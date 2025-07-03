import { useMutation } from '@tanstack/react-query';
import startSession, { IStartSessionRequest } from '../api/startSession';

const useStartSession = () => {
  return useMutation({
    mutationFn: (data: IStartSessionRequest) => startSession(data),
  });
};
export default useStartSession;
