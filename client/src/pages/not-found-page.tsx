import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <Link to="/users" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
