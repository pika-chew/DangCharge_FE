import axios, { type AxiosRequestConfig } from 'axios'

const queryClient = axios.create({
  baseURL: import.meta.env.VITE_QUERY_API_URL || 'https://api.dangcharge.cloud/query',
})

const commandClient = axios.create({
  baseURL: import.meta.env.VITE_COMMAND_API_URL || 'https://api.dangcharge.cloud/command',
})

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
