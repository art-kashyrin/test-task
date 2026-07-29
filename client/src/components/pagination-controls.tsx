interface PaginationControlsProps {
  offset: number
  limit: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function PaginationControls({
  offset,
  limit,
  total,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isFirstPage = offset === 0
  const isLastPage = offset + limit >= total

  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
