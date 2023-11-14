import { useMutation } from '@tanstack/react-query';

import { authAPI } from '../authAPIService';

export function useLogin() {
  return useMutation({ mutationFn: authAPI.login });
}
