import { createContext, useCallback, useSyncExternalStore, type ReactNode } from 'react'
import { clearToken, getToken, setToken, subscribeToken } from './auth-storage'

export interface AuthContextValue {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(subscribeToken, getToken)

  const login = useCallback((next: string) => {
    setToken(next)
  }, [])

  const logout = useCallback(() => {
    clearToken()
  }, [])

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}
