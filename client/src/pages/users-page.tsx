import { useState } from 'react'
import { CityStatsTable } from '../components/city-stats-table'
import { PaginationControls } from '../components/pagination-controls'
import { useCityStats } from '../hooks/use-city-stats'
import { isSameCityStatsPage } from '../shared/city-stats-equal'

const LIMIT = 10

export function UsersPage() {
  const [offset, setOffset] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)

  const query = useCityStats(LIMIT, offset)

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
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={query.isFetching}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      {message !== null && <p className="text-sm text-gray-600">{message}</p>}
      {refreshError !== null && <p className="text-sm text-red-600">{refreshError}</p>}
      {query.isPending && <p className="text-sm text-gray-500">Loading…</p>}
      {query.isError && <p className="text-sm text-red-600">Could not load city stats.</p>}
      {}
      {query.data !== undefined && (
        <>
          <CityStatsTable items={query.data.items} />
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
