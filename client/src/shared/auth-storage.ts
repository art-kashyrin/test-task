const STORAGE_KEY = 'users-by-city.token'

function readFromStorage(): string | null {
  return window.localStorage.getItem(STORAGE_KEY)
}

let currentToken: string | null = readFromStorage()

const listeners = new Set<() => void>()

function notify(): void {
  for (const listener of listeners) listener()
}

export function getToken(): string | null {
  return currentToken
}

export function setToken(token: string): void {
  currentToken = token
  window.localStorage.setItem(STORAGE_KEY, token)
  notify()
}

export function clearToken(): void {
  currentToken = null
  window.localStorage.removeItem(STORAGE_KEY)
  notify()
}

export function subscribeToken(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
