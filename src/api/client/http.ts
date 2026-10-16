import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { setAuthTokens, synchronizeAuthSession, type AuthTokens } from '@/lib/auth'
import type { ApiResponseDtoAccessTokenResponse } from '../generated/command'

type AuthRequestConfig = InternalAxiosRequestConfig & {
  authRetried?: boolean
  authSession?: AuthTokens
}

const commandBaseURL = import.meta.env.VITE_COMMAND_API_URL
  || (import.meta.env.DEV ? '/command' : 'https://api.dangcharge.cloud/command')

const queryClient = axios.create({
  baseURL: import.meta.env.VITE_QUERY_API_URL
    || (import.meta.env.DEV ? '/query' : 'https://api.dangcharge.cloud/query'),
})

const commandClient = axios.create({
  baseURL: commandBaseURL,
})

// 재발급 요청은 일반 인터셉터를 우회해 401 재귀를 막습니다.
const refreshClient = axios.create({ baseURL: commandBaseURL, timeout: 15_000 })
let pendingRefresh: { session: AuthTokens; promise: Promise<AuthTokens> } | null = null

function isAuthRequest(config: AxiosRequestConfig) {
  return /^\/api\/v1\/auth\/(login|signup|refresh)(?:\?|$)/.test(config.url ?? '')
}

async function refreshSession(session: AuthTokens): Promise<AuthTokens> {
  try {
    const { data: response } = await refreshClient.post<ApiResponseDtoAccessTokenResponse>(
      '/api/v1/auth/refresh',
      { refreshToken: session.refreshToken },
    )
    const accessToken = response.data?.accessToken
    if (response.success !== true || typeof accessToken !== 'string' || !accessToken.trim()) {
      throw new Error('인증 정보를 갱신할 수 없어요. 다시 로그인해주세요.')
    }
    // 재발급을 기다리는 동안 로그아웃하거나 다른 계정으로 로그인한 경우 덮어쓰지 않습니다.
    if (synchronizeAuthSession() !== session) throw new Error('로그인 상태가 변경되었어요.')

    const next = { ...session, accessToken }
    setAuthTokens(next)
    return next
  } catch (error) {
    if (synchronizeAuthSession() === session) setAuthTokens(null)
    throw error
  }
}

function getRefreshedSession(session: AuthTokens) {
  if (pendingRefresh?.session === session) return pendingRefresh.promise

  const promise = refreshSession(session).finally(() => {
    if (pendingRefresh?.promise === promise) pendingRefresh = null
  })
  pendingRefresh = { session, promise }
  return promise
}

async function recoverUnauthorized(error: unknown, client: AxiosInstance) {
  if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config || isAuthRequest(error.config)) {
    throw error
  }

  const config = error.config as AuthRequestConfig
  const session = synchronizeAuthSession()
  if (!session) {
    setAuthTokens(null)
    throw error
  }
  if (!config.authSession || config.authSession.refreshToken !== session.refreshToken) throw error

  const sentToken = config.headers.get('Authorization')
  if (config.authRetried) {
    if (sentToken === `Bearer ${session.accessToken}`) setAuthTokens(null)
    throw error
  }
  config.authRetried = true

  // 다른 요청이 이미 갱신했다면 최신 토큰으로만 재시도합니다.
  const next = sentToken !== `Bearer ${session.accessToken}`
    ? session : await getRefreshedSession(session)
  if (synchronizeAuthSession() !== next) throw error

  config.headers.set('Authorization', `Bearer ${next.accessToken}`)
  return client.request(config)
}

for (const client of [queryClient, commandClient]) {
  client.interceptors.request.use((config) => {
    const tokens = synchronizeAuthSession()
    const authConfig = config as AuthRequestConfig
    if (authConfig.authRetried && (!tokens || authConfig.authSession?.refreshToken !== tokens.refreshToken)) {
      throw new axios.CanceledError('로그인 상태가 변경되어 요청을 취소했어요.')
    }
    if (tokens && !isAuthRequest(config)) {
      config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
      authConfig.authSession = tokens
    } else {
      config.headers.delete('Authorization')
      delete authConfig.authSession
    }
    return config
  })
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => recoverUnauthorized(error, client),
  )
}

export async function queryRequest<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await queryClient.request<T>({ ...config, ...options })
  return response.data
}

export async function commandRequest<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await commandClient.request<T>({ ...config, ...options })
  return response.data
}
