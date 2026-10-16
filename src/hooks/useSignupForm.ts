import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'

const signupSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]{4,20}$/, '영문 소문자와 숫자로 4~20자를 입력해주세요.'),
    username: z.string().trim().min(1, '유저네임을 입력해주세요.').max(20, '유저네임은 20자 이하로 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(1, '비밀번호를 한 번 더 입력해주세요.'),
    vehicleModelId: z.string().min(1, '차종을 선택해주세요.'),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않아요.',
  })

export type SignupFormValues = z.infer<typeof signupSchema>

export function useSignupForm() {
  const navigate = useNavigate()
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { id: '', username: '', password: '', passwordConfirm: '', vehicleModelId: '' },
  })

  // API 연결 전 데모용 이동입니다. 회원가입 요청의 백엔드 응답이 성공일 때만 이동하도록 바꿔야 합니다.
  const onSubmit = form.handleSubmit(() => navigate('/login'))

  return { form, onSubmit }
}
