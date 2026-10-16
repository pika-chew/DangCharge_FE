import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRef, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { commandApi, getServerErrorMessage } from '@/api'
import { isAuthTokens } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  id: z.string().trim().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

function getLoginErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) return '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'
    if (error.response.status < 500) {
      return getServerErrorMessage(error.response.data)
        ?? '아이디 또는 비밀번호가 올바르지 않아요.'
    }
  }

  return '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'
}

export function useLoginForm() {
  const { login } = useAuth()
  const { mutateAsync } = commandApi.useLogin({ mutation: { retry: false } })
  const submissionInFlight = useRef(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', password: '' },
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInFlight.current) return
    submissionInFlight.current = true

    try {
      await form.handleSubmit(async ({ id, password }) => {
        try {
          const response = await mutateAsync({ data: { loginId: id, password } })
          if (response.success !== true || !isAuthTokens(response.data)) {
            form.setError('root', {
              message: getServerErrorMessage(response) ?? '로그인 응답을 확인할 수 없어요. 다시 시도해주세요.',
            })
            return
          }

          login(response.data)
        } catch (error) {
          form.setError('root', { message: getLoginErrorMessage(error) })
        }
      })(event)
    } finally {
      submissionInFlight.current = false
    }
  }

  return { form, onSubmit }
}
