import { useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '@/hooks'
import { getAuthTokens, setAuthTokens, type AuthTokens } from '@/lib/auth'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => getAuthTokens() !== null)
  const queryClient = useQueryClient()

  const value = useMemo(() => ({
    isLoggedIn,
    login: (tokens: AuthTokens) => {
      setAuthTokens(tokens)
      setIsLoggedIn(true)
    },
    logout: () => {
      setAuthTokens(null)
      queryClient.clear()
      setIsLoggedIn(false)
    },
  }), [isLoggedIn, queryClient])

  return <AuthContext value={value}>{children}</AuthContext>
}
