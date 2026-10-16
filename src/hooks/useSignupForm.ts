import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { commandApi, getApiErrorMessage, getServerErrorMessage } from '@/api'
import { useVehicleModels } from '@/hooks/useVehicleModels'

const signupSchema = z
  .object({
    id: z.string().trim().min(4, '아이디는 4자 이상 입력해주세요.')
      .max(50, '아이디는 50자 이하로 입력해주세요.')
      .regex(/^[A-Za-z0-9_.-]+$/, '아이디는 영문, 숫자, 밑줄(_), 점(.), 하이픈(-)만 사용할 수 있어요.'),
    username: z.string().trim().min(1, '유저네임을 입력해주세요.').max(50, '유저네임은 50자 이하로 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(64, '비밀번호는 64자 이하로 입력해주세요.')
      .regex(/[A-Za-z]/, '비밀번호에 영문을 포함해주세요.')
      .regex(/[0-9]/, '비밀번호에 숫자를 포함해주세요.'),
    passwordConfirm: z.string().min(1, '비밀번호를 한 번 더 입력해주세요.'),
    vehicleModel: z.enum(commandApi.SignupRequestVehicleModel, { error: '차종을 선택해주세요.' }),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않아요.',
  })

export type SignupFormValues = z.infer<typeof signupSchema>

export function useSignupForm() {
  const navigate = useNavigate()
  const vehicleModelsQuery = useVehicleModels()
  const { mutateAsync } = commandApi.useSignup({ mutation: { retry: false } })
  const submissionInFlight = useRef(false)
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { id: '', username: '', password: '', passwordConfirm: '' },
  })

  const vehicleModels = vehicleModelsQuery.data ?? []
  const vehicleModelsUnavailable = vehicleModelsQuery.isPending
    || vehicleModelsQuery.isError || vehicleModels.length === 0

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionInFlight.current) return
    submissionInFlight.current = true

    try {
      await form.handleSubmit(async ({ id, username, password, vehicleModel }) => {
        if (vehicleModelsUnavailable || !vehicleModels.some((model) => model.value === vehicleModel)) {
          form.setError('vehicleModel', { message: '차종 목록을 다시 불러온 뒤 선택해주세요.' })
          return
        }

        try {
          const response = await mutateAsync({
            data: { loginId: id, username, password, vehicleModel },
          })
          if (response.success !== true) {
            form.setError('root', {
              message: getServerErrorMessage(response) ?? '회원가입을 완료하지 못했어요. 다시 시도해주세요.',
            })
            return
          }

          navigate('/login', { replace: true })
        } catch (error) {
          form.setError('root', {
            message: getApiErrorMessage(error, '회원가입 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'),
          })
        }
      })(event)
    } finally {
      submissionInFlight.current = false
    }
  }

  return { form, onSubmit, vehicleModels, vehicleModelsQuery, vehicleModelsUnavailable }
}
