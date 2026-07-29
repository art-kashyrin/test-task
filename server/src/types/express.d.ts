export interface AuthUser {
  id: number
  name: string
}

declare global {
  namespace Express {
    interface User extends AuthUser {}
    interface Request {
      user?: AuthUser
    }
  }
}

export {}
