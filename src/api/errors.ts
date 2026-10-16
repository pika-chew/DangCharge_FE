import { isAxiosError } from 'axios'
import { z } from 'zod'

const errorResponseSchema = z.object({
  error: z.object({ message: z.string().trim().min(1) }),
})

export function getServerErrorMessage(data: unknown) {
  const result = errorResponseSchema.safeParse(data)
  return result.success ? result.data.error.message : undefined
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    if (!error.response) return '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'
    if (error.response.status < 500) {
      return getServerErrorMessage(error.response.data) ?? fallback
    }
  }

  return fallback
}
