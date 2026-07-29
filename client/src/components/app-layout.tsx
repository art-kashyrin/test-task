import { Outlet } from 'react-router'
import { AppHeader } from './app-header'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
