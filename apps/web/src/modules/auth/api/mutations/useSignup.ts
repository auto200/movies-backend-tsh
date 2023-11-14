import { useMutation } from '@tanstack/react-query';

import { authAPI } from '../authAPIService';

export function useSignup() {
  return useMutation({ mutationFn: authAPI.signup });
}
