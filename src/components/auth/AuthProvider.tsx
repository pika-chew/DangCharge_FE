import { useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import { AuthContext } from '@/hooks'
import { getAuthTokens, setAuthTokens, subscribeAuthSession, type AuthTokens } from '@/lib/auth'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const tokens = useSyncExternalStore(subscribeAuthSession, getAuthTokens)
  const queryClient = useQueryClient()
  const previousSession = useRef(tokens)
  // 경로 이동 시 저장소에서 직접 삭제된 토큰도 다시 확인합니다.
  useLocation()

  useEffect(() => {
    if (previousSession.current && !tokens) queryClient.clear()
    previousSession.current = tokens
  }, [tokens, queryClient])

  const value = useMemo(() => ({
    isLoggedIn: tokens !== null,
    login: (tokens: AuthTokens) => {
      setAuthTokens(tokens)
    },
    logout: () => {
      setAuthTokens(null)
      queryClient.clear()
    },
  }), [tokens, queryClient])

  return <AuthContext value={value}>{children}</AuthContext>
}
