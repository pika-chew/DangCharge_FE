import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { commandApi, queryApi } from '@/api'
import { AuthProvider, GuestOnly, LoginForm, RequireAuth } from '@/components/auth'
import { useAuth } from '@/hooks'
import { getAuthTokens, setAuthTokens } from '@/lib/auth'

const { adapter } = vi.hoisted(() => ({ adapter: vi.fn() }))

vi.mock('axios', async (importOriginal) => {
  const original = await importOriginal<typeof import('axios')>()
  const create = original.default.create.bind(original.default)
  vi.spyOn(original.default, 'create').mockImplementation((config) => create({ ...config, adapter }))
  return original
})

const tokens = { accessToken: 'test-access-token', refreshToken: 'test-refresh-token' }

function response(data: unknown, status = 200): AxiosResponse {
  return { data, status, statusText: '', headers: {}, config: { headers: {} } } as AxiosResponse
}

function CurrentLocation() {
  const { pathname, search, hash } = useLocation()
  return <p>{pathname}{search}{hash}</p>
}

function LogoutControl() {
  const { isLoggedIn, logout } = useAuth()
  return isLoggedIn ? <button onClick={logout}>세션 종료</button> : null
}

function renderLogin(from?: { pathname: string; search: string; hash: string }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[{ pathname: '/login', state: from ? { from } : null }]}>
        <AuthProvider>
          <LogoutControl />
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginForm />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="*" element={<CurrentLocation />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return queryClient
}

function submitLogin() {
  fireEvent.change(screen.getByLabelText('아이디'), { target: { value: '  driver  ' } })
  fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
  fireEvent.click(screen.getByRole('button', { name: '로그인' }))
}

beforeEach(() => {
  adapter.mockReset()
  sessionStorage.clear()
  setAuthTokens(null)
})

afterEach(() => {
  cleanup()
  setAuthTokens(null)
})

describe('login API integration', () => {
  it('validates empty inputs without sending a request', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    await screen.findByText('아이디를 입력해주세요.')
    expect(adapter).not.toHaveBeenCalled()
  })

  it('posts credentials to command, stores tokens, and goes home even when a previous URL exists', async () => {
    adapter.mockResolvedValue(response({ success: true, data: tokens }))
    renderLogin({ pathname: '/stations/7', search: '?tab=chargers', hash: '#list' })
    submitLogin()

    await screen.findByText('/')
    const request = adapter.mock.calls[0][0] as AxiosRequestConfig
    expect(request.baseURL).toBe('/command')
    expect(request.url).toBe('/api/v1/auth/login')
    expect(request.method).toBe('post')
    expect(JSON.parse(request.data)).toEqual({ loginId: 'driver', password: 'password123' })
    expect(getAuthTokens()).toEqual(tokens)
    expect(JSON.parse(sessionStorage.getItem('dangcharge:auth-tokens')!)).toEqual(tokens)
  })

  it('goes to the home page when there is no intended URL', async () => {
    adapter.mockResolvedValue(response({ success: true, data: tokens }))
    renderLogin()
    submitLogin()
    await screen.findByText('/')
  })

  it.each([
    { success: true, data: { accessToken: 'access-only' } },
    { success: true, data: { accessToken: '', refreshToken: 'refresh' } },
    { success: true, data: null },
  ])('rejects a success response with invalid tokens: %j', async (data) => {
    adapter.mockResolvedValue(response(data))
    renderLogin()
    submitLogin()
    await screen.findByRole('alert')
    expect(getAuthTokens()).toBeNull()
    expect(sessionStorage.getItem('dangcharge:auth-tokens')).toBeNull()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDefined()
  })

  it('shows an application error returned with HTTP 200', async () => {
    adapter.mockResolvedValue(response({ success: false, error: { message: '로그인 정보를 확인해주세요.' } }))
    renderLogin()
    submitLogin()
    expect((await screen.findByRole('alert')).textContent).toBe('로그인 정보를 확인해주세요.')
    expect(getAuthTokens()).toBeNull()
  })

  it.each([
    [401, '등록되지 않은 계정입니다.', '등록되지 않은 계정입니다.'],
    [401, null, '아이디 또는 비밀번호가 올바르지 않아요.'],
    [503, 'internal detail', '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'],
    [0, null, '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'],
  ])('handles HTTP/network failure %i without logging in or retrying', async (status, message, expected) => {
    adapter.mockRejectedValue(new AxiosError(
      'Request failed',
      undefined,
      undefined,
      undefined,
      status ? response({ error: { message } }, status) : undefined,
    ))
    renderLogin()
    submitLogin()
    expect((await screen.findByRole('alert')).textContent).toBe(expected)
    expect(getAuthTokens()).toBeNull()
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('blocks repeated submission while a request is pending', async () => {
    let finish!: (value: AxiosResponse) => void
    adapter.mockReturnValue(new Promise<AxiosResponse>((resolve) => { finish = resolve }))
    renderLogin()
    const form = screen.getByRole('button', { name: '로그인' }).closest('form')!
    submitLogin()
    await waitFor(() => expect(adapter).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('button', { name: '로그인 중…' }).hasAttribute('disabled')).toBe(true)
    fireEvent.submit(form)
    await waitFor(() => expect(adapter).toHaveBeenCalledTimes(1))
    finish(response({ success: true, data: tokens }))
    await screen.findByText('/')
  })

  it('restores a session, attaches the token to both services, and clears it and cached data on logout', async () => {
    setAuthTokens(tokens)
    adapter.mockResolvedValue(response({ success: true }))
    const client = renderLogin()
    await screen.findByText('/')
    client.setQueryData(['private-profile'], { name: 'driver' })

    await queryApi.getMe()
    await commandApi.createReservation({ chargerId: 1, startAt: '2026-10-16T10:00:00+09:00' })
    for (const [request] of adapter.mock.calls) {
      expect(request.headers.get('Authorization')).toBe('Bearer test-access-token')
    }
    expect(adapter.mock.calls[0][0].baseURL).toBe('/query')
    expect(adapter.mock.calls[1][0].baseURL).toBe('/command')

    fireEvent.click(screen.getByRole('button', { name: '세션 종료' }))
    await screen.findByRole('button', { name: '로그인' })
    expect(getAuthTokens()).toBeNull()
    expect(sessionStorage.getItem('dangcharge:auth-tokens')).toBeNull()
    expect(client.getQueryData(['private-profile'])).toBeUndefined()
    await queryApi.getMe()
    expect(adapter.mock.calls.at(-1)![0].headers.has('Authorization')).toBe(false)
  })
})
