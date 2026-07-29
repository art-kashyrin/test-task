import { useLogout } from '../hooks/use-logout'

export function AppHeader() {
  const logout = useLogout()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <span className="text-lg font-semibold text-gray-900">Users by City</span>
      <button
        type="button"
        onClick={logout}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Logout
      </button>
    </header>
  )
}
