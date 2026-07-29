import { $api } from '../api/client'

export function useLogin() {
  return $api.useMutation('post', '/auth/login')
}
