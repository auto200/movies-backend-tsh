import { useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { authAPI } from '../authAPIService';
import { queryKeys } from '../queryKeys';

export function useUser() {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryFn: authAPI.getUser,
    queryKey: queryKeys.user,
    retry: false,
  });

  // Clear previous data. Scenario: user was logged in - data available, user logs out, query gets
  // invalidated but we have to clear previous data manually
  useEffect(() => {
    if (result.isError) {
      queryClient.setQueryData(queryKeys.user, null);
    }
  }, [result, queryClient]);

  return result;
}
