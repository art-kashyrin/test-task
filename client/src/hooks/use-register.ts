import { $api } from '../api/client'

export function useRegister() {
  return $api.useMutation('post', '/auth/register')
}
