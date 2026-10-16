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

function readStoredTokens(): AuthTokens | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
    return isAuthTokens(value) ? value : null
  } catch {
    return null
  }
}

let tokens = readStoredTokens()

export function getAuthTokens(): AuthTokens | null {
  return tokens
}

export function setAuthTokens(value: AuthTokens | null) {
  tokens = value

  try {
    if (value) sessionStorage.setItem(storageKey, JSON.stringify(value))
    else sessionStorage.removeItem(storageKey)
  } catch {
    // 저장소 접근이 제한된 브라우저에서는 현재 메모리에서만 세션을 유지합니다.
  }
}
