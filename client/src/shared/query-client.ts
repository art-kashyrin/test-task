import { QueryClient } from '@tanstack/react-query'
import { isApiErrorBody } from '../api/client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Number.POSITIVE_INFINITY,

      retry: (failureCount, error) =>
        !(isApiErrorBody(error) && error.statusCode === 401) && failureCount < 2,
    },
  },
})
