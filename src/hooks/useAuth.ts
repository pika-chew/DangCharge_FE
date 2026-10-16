import { createContext, useContext } from 'react'
import type { AuthTokens } from '@/lib/auth'

export type AuthContextValue = {
  isLoggedIn: boolean
  login: (tokens: AuthTokens) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')

  return auth
}
