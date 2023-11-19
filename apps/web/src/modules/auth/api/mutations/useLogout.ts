import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authAPI } from '../authAPIService';
import { queryKeys } from '../queryKeys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSettled: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}
