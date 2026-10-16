import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { demoLoginAccount } from '@/constants'

const loginSchema = z.object({
  id: z.string().trim().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLoginForm() {
  const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', password: '' },
  })

  const onSubmit = form.handleSubmit(({ id, password }) => {
    if (id !== demoLoginAccount.id || password !== demoLoginAccount.password) {
      form.setError('root', { message: '아이디 또는 비밀번호가 올바르지 않아요.' })
      return
    }

    navigate('/')
  })

  return { form, onSubmit }
}
