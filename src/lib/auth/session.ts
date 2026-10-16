export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

const storageKey = 'dangcharge:auth-tokens'

export function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== 'object' || value === null) return false

  return 'accessToken' in value && typeof value.accessToken === 'string'
    && value.accessToken.trim().length > 0
    && 'refreshToken' in value && typeof value.refreshToken === 'string'
    && value.refreshToken.trim().length > 0
}

function parseStoredTokens(value: string | null): AuthTokens | null {
  try {
    const parsed: unknown = JSON.parse(value ?? 'null')
    return isAuthTokens(parsed) ? parsed : null
  } catch {
    return null
  }
}

let tokens: AuthTokens | null = null
let storedValue: string | null | undefined
let memoryOnly = false
const listeners = new Set<() => void>()

export function getAuthTokens(): AuthTokens | null {
  if (!memoryOnly) {
    try {
      const value = sessionStorage.getItem(storageKey)
      if (value !== storedValue) {
        storedValue = value
        tokens = parseStoredTokens(value)
      }
    } catch {
      memoryOnly = true
    }
  }

  return tokens
}

function notifyListeners() {
  for (const listener of listeners) listener()
}

export function synchronizeAuthSession() {
  const previous = tokens
  const current = getAuthTokens()
  if (previous !== current) notifyListeners()
  return current
}

export function subscribeAuthSession(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener('storage', synchronizeAuthSession)
    window.addEventListener('focus', synchronizeAuthSession)
    document.addEventListener('visibilitychange', synchronizeAuthSession)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', synchronizeAuthSession)
      window.removeEventListener('focus', synchronizeAuthSession)
      document.removeEventListener('visibilitychange', synchronizeAuthSession)
    }
  }
}

export function setAuthTokens(value: AuthTokens | null) {
  tokens = value

  try {
    const serialized = value ? JSON.stringify(value) : null
    if (serialized !== null) sessionStorage.setItem(storageKey, serialized)
    else sessionStorage.removeItem(storageKey)
    storedValue = serialized
    memoryOnly = false
  } catch {
    // 저장소 접근이 제한된 브라우저에서는 현재 메모리에서만 세션을 유지합니다.
    memoryOnly = true
  }
  notifyListeners()
}
