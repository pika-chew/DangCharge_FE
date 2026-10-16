import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/hooks'

// API 연결 전 데모용 로그인 표시입니다. 실제 인증 방식이 정해지면 이 Provider 안쪽만 교체합니다.
const storageKey = 'dangcharge:demo-logged-in'

function readLoggedIn() {
  try {
    return sessionStorage.getItem(storageKey) === 'true'
  } catch {
    return false
  }
}

function writeLoggedIn(loggedIn: boolean) {
  try {
    if (loggedIn) sessionStorage.setItem(storageKey, 'true')
    else sessionStorage.removeItem(storageKey)
  } catch {
    // 저장소를 쓸 수 없으면 현재 탭의 상태로만 유지합니다.
  }
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(readLoggedIn)

  const value = useMemo(() => ({
    isLoggedIn,
    login: () => {
      writeLoggedIn(true)
      setIsLoggedIn(true)
    },
    logout: () => {
      writeLoggedIn(false)
      setIsLoggedIn(false)
    },
  }), [isLoggedIn])

  return <AuthContext value={value}>{children}</AuthContext>
}
