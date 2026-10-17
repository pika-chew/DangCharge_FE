import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { commandApi, getApiErrorMessage, getServerErrorMessage, queryApi } from '@/api'
import type { UserProfile } from '@/hooks/useMyPageData'

const editProfileSchema = z.object({
  username: z.string().trim().min(1, '유저명을 입력해주세요.').max(50, '유저명은 50자 이하로 입력해주세요.'),
  vehicleModel: z.enum(commandApi.UpdateUserRequestVehicleModel, { error: '차종을 선택해주세요.' }),
})

const updatedUserSchema = z.object({
  username: z.string().trim().min(1),
  vehicleModel: z.enum(commandApi.UserResponseVehicleModel),
})

export type EditProfileFormValues = z.infer<typeof editProfileSchema>

type UseEditProfileFormOptions = {
  user?: UserProfile
  vehicleChangeBlocked: boolean
}

export function useEditProfileForm({ user, vehicleChangeBlocked }: UseEditProfileFormOptions) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutateAsync } = commandApi.useUpdateMe({ mutation: { retry: false } })
  const submissionInFlight = useRef(false)
  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { username: '' },
  })

  useEffect(() => {
    if (!user) return
    form.reset({ username: user.username, vehicleModel: user.vehicleModel })
  }, [form, user])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || submissionInFlight.current) return
    submissionInFlight.current = true

    try {
      await form.handleSubmit(async ({ username, vehicleModel }) => {
        const data: commandApi.UpdateUserRequest = {}
        const trimmedUsername = username.trim()

        if (trimmedUsername !== user.username) data.username = trimmedUsername
        if (vehicleModel !== user.vehicleModel) {
          if (vehicleChangeBlocked) {
            form.setError('vehicleModel', { message: '진행 중인 예약이 있으면 차종을 수정할 수 없어요.' })
            return
          }
          data.vehicleModel = vehicleModel
        }

        if (Object.keys(data).length === 0) {
          form.setError('root', { message: '변경된 정보가 없어요.' })
          return
        }

        try {
          const response = await mutateAsync({ data })
          if (response.success !== true) {
            form.setError('root', {
              message: getServerErrorMessage(response) ?? '내 정보를 수정하지 못했어요. 다시 시도해주세요.',
            })
            return
          }

          const updatedUser = updatedUserSchema.safeParse(response.data)
          if (!updatedUser.success) {
            form.setError('root', { message: '수정된 사용자 정보를 확인할 수 없어요.' })
            return
          }

          queryClient.setQueryData(queryApi.getGetMeQueryKey(), {
            ...response,
            data: { ...response.data, ...updatedUser.data },
          })
          navigate('/mypage', { replace: true })
        } catch (error) {
          form.setError('root', {
            message: getApiErrorMessage(error, '내 정보 수정 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'),
          })
        }
      })(event)
    } finally {
      submissionInFlight.current = false
    }
  }

  return { form, onSubmit }
}
