import createFetchClient, { type Middleware } from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'
import type { components, paths } from './schema'
import { clearToken, getToken } from '../shared/auth-storage'

export type ApiErrorBody = components['schemas']['ErrorResponseDto']

export function isApiErrorBody(error: unknown): error is ApiErrorBody {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  )
}

let onUnauthorized: () => void = () => undefined

export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
}

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const token = getToken()
    if (token !== null) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
  onResponse({ response }) {
    if (response.status === 401) {
      clearToken()
      onUnauthorized()
    }
    return response
  },
}
fetchClient.use(authMiddleware)

export const $api = createQueryClient(fetchClient)
