import { useMutation } from '@tanstack/react-query';
import createSession, { ICreateSessionRequest } from '../api/createSession';

const useCreateSession = () => {
  return useMutation({
    mutationFn: (data: ICreateSessionRequest) => createSession(data),
  });
};
export default useCreateSession;
