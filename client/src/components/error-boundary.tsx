import { isRouteErrorResponse, useRouteError } from 'react-router'

export function ErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something went wrong.'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-red-700">Something went wrong</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}
