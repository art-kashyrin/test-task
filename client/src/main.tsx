import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { setUnauthorizedHandler } from './api/client'
import { AuthProvider } from './shared/auth-context'
import { queryClient } from './shared/query-client'
import { router } from './router'
import './index.css'

setUnauthorizedHandler(() => {
  queryClient.clear()
  void router.navigate('/login', { replace: true })
})

const rootElement = document.getElementById('root')
if (rootElement === null) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
