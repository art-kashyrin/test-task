import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/use-auth'

export function RequireAuth() {
  const { token } = useAuth()
  if (token === null) return <Navigate to="/login" replace />
  return <Outlet />
}
