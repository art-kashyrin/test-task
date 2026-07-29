import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout } = useAuth()

  return useCallback(() => {
    logout()
    queryClient.clear()
    void navigate('/login', { replace: true })
  }, [logout, queryClient, navigate])
}
