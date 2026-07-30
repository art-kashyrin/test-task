import { useState } from 'react'
import { CityStatsTable } from '../components/city-stats-table'
import { PaginationControls } from '../components/pagination-controls'
import { useCityStats } from '../hooks/use-city-stats'
import { isSameCityStatsPage } from '../shared/city-stats-equal'
import { Select } from '@base-ui/react/select'

const LIMIT = 10

export function UsersPage() {
  const [offset, setOffset] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [sort, setSort] = useState<string | null>(null)

  const query = useCityStats(LIMIT, offset)

  const sortOptions = [
    { value: 'asc', label: 'ASC' },
    { value: 'desc', label: 'DESC' },
  ]

  const cities = [...(query.data?.items ?? [])].sort((a, b) => {
    if (sort === 'asc') {
      return a.city.localeCompare(b.city)
    }

    if (sort === 'desc') {
      return b.city.localeCompare(a.city)
    }

    return 0
  })

  const onRefresh = async (): Promise<void> => {
    setRefreshError(null)

    const before = query.data
    const result = await query.refetch()
    if (!result.isSuccess) {
      setMessage(null)
      setRefreshError('Could not refresh — please try again.')
      return
    }
    if (before === undefined) {
      setMessage(null)
      return
    }
    setMessage(isSameCityStatsPage(before, result.data) ? 'no changes to update' : null)
  }

  const goToPage = (nextOffset: number): void => {
    setOffset(nextOffset)
    setMessage(null)
    setRefreshError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Registered users by city</h1>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={query.isFetching}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>

          <Select.Root items={sortOptions} value={sort} onValueChange={setSort}>
            <Select.Trigger className="flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <Select.Value placeholder="Sort" />
              <Select.Icon className="text-gray-400">▾</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner className="z-10" sideOffset={4}>
                <Select.Popup className="max-h-64 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <Select.List>
                    {sortOptions.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer px-3 py-2 text-sm data-[highlighted]:bg-blue-50"
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      {message !== null && <p className="text-sm text-gray-600">{message}</p>}
      {refreshError !== null && <p className="text-sm text-red-600">{refreshError}</p>}
      {query.isPending && <p className="text-sm text-gray-500">Loading…</p>}
      {query.isError && <p className="text-sm text-red-600">Could not load city stats.</p>}
      {query.data !== undefined && (
        <>
          <CityStatsTable items={cities} />
          <PaginationControls
            offset={offset}
            limit={LIMIT}
            total={query.data.total}
            onPrev={() => {
              goToPage(Math.max(0, offset - LIMIT))
            }}
            onNext={() => {
              goToPage(offset + LIMIT)
            }}
          />
        </>
      )}
    </div>
  )
}
