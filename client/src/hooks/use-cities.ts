import { $api } from '../api/client'

export function useCities() {
  return $api.useQuery('get', '/cities')
}

export type City = NonNullable<ReturnType<typeof useCities>['data']>[number]
