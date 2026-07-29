import { createBrowserRouter, Outlet } from 'react-router'
import { AppLayout } from './components/app-layout'
import { AuthLayout } from './components/auth-layout'
import { ErrorBoundary } from './components/error-boundary'
import { IndexRedirect } from './components/index-redirect'
import { RequireAuth } from './components/require-auth'
import { LoginPage } from './pages/login-page'
import { NotFoundPage } from './pages/not-found-page'
import { RegisterPage } from './pages/register-page'
import { UsersPage } from './pages/users-page'

function RootLayout() {
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          {
            Component: AppLayout,
            children: [
              { index: true, Component: IndexRedirect },
              { path: '/users', Component: UsersPage },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
