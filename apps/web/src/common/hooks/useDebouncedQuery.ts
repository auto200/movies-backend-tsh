import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "usehooks-ts";

type Config = {
  debounceMs: number;
  omitDebounceOnCacheHit: boolean;
};

// NOTE: type definitions are just a copy paste of `useQuery` type definition
export function useDebouncedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  config: Config = { debounceMs: 500, omitDebounceOnCacheHit: true }
): UseQueryResult<TData, TError> {
  const debouncedOptions = useDebounce(options, config.debounceMs);

  const isCached =
    config.omitDebounceOnCacheHit && options.queryKey
      ? !!useQueryClient().getQueryCache().find(options.queryKey)
      : false;

  return useQuery(isCached ? options : debouncedOptions);
}
