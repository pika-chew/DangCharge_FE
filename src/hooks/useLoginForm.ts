import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, type Location } from 'react-router'
import { z } from 'zod'
import { demoLoginAccount } from '@/constants'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  id: z.string().trim().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

function getRedirectPath(state: unknown) {
  const from = (state as { from?: Location } | null)?.from

  return from ? `${from.pathname}${from.search}${from.hash}` : '/'
}

export function useLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', password: '' },
  })

  const onSubmit = form.handleSubmit(({ id, password }) => {
    if (id !== demoLoginAccount.id || password !== demoLoginAccount.password) {
      form.setError('root', { message: '아이디 또는 비밀번호가 올바르지 않아요.' })
      return
    }

    login()
    navigate(getRedirectPath(location.state), { replace: true })
  })

  return { form, onSubmit }
}
