import axios, { type AxiosRequestConfig } from 'axios'
import { getAuthTokens } from '@/lib/auth'

const queryClient = axios.create({
  baseURL: import.meta.env.VITE_QUERY_API_URL
    || (import.meta.env.DEV ? '/query' : 'https://api.dangcharge.cloud/query'),
})

const commandClient = axios.create({
  baseURL: import.meta.env.VITE_COMMAND_API_URL
    || (import.meta.env.DEV ? '/command' : 'https://api.dangcharge.cloud/command'),
})

for (const client of [queryClient, commandClient]) {
  client.interceptors.request.use((config) => {
    const tokens = getAuthTokens()
    if (tokens) config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    return config
  })
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
