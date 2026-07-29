import type { CityStat, CityStatsPage } from '../hooks/use-city-stats'

function isSameCityStat(a: CityStat, b: CityStat): boolean {
  return a.city === b.city && a.count === b.count
}

export function isSameCityStatsPage(a: CityStatsPage, b: CityStatsPage): boolean {
  if (a.total !== b.total || a.limit !== b.limit || a.offset !== b.offset) return false
  if (a.items.length !== b.items.length) return false
  return a.items.every((item, index) => isSameCityStat(item, b.items[index]))
}
