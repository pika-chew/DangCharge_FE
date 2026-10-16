import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  sessionStorage.clear()
  vi.resetModules()
  vi.restoreAllMocks()
})

describe('stored auth session', () => {
  it('restores valid tokens after a module reload', async () => {
    const tokens = { accessToken: 'access', refreshToken: 'refresh' }
    sessionStorage.setItem('dangcharge:auth-tokens', JSON.stringify(tokens))
    const { getAuthTokens } = await import('@/lib/auth')
    expect(getAuthTokens()).toEqual(tokens)
  })

  it.each(['invalid JSON', '{"accessToken":"access"}', 'null', '{"accessToken":12,"refreshToken":"refresh"}'])('ignores invalid stored tokens: %s', async (value) => {
    sessionStorage.setItem('dangcharge:auth-tokens', value)
    const { getAuthTokens } = await import('@/lib/auth')
    expect(getAuthTokens()).toBeNull()
  })

  it('does not accept the previous demo login flag', async () => {
    sessionStorage.setItem('dangcharge:demo-logged-in', 'true')
    const { getAuthTokens } = await import('@/lib/auth')
    expect(getAuthTokens()).toBeNull()
  })

  it('keeps the current session in memory when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
    const { getAuthTokens, setAuthTokens } = await import('@/lib/auth')
    expect(getAuthTokens()).toBeNull()
    setAuthTokens({ accessToken: 'access', refreshToken: 'refresh' })
    expect(getAuthTokens()?.accessToken).toBe('access')
    setAuthTokens(null)
    expect(getAuthTokens()).toBeNull()
  })
})
