import { $api } from '../api/client'

const cityStatsInit = (limit: number, offset: number) => ({
  params: { query: { limit, offset } },
})

export function useCityStats(limit: number, offset: number) {
  return $api.useQuery('get', '/users', cityStatsInit(limit, offset))
}

export type CityStatsPage = NonNullable<ReturnType<typeof useCityStats>['data']>
export type CityStat = CityStatsPage['items'][number]
