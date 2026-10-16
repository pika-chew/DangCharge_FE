import { z } from 'zod'
import { getServerErrorMessage, queryApi } from '@/api'

const userSchema = z.object({
  username: z.string().trim().min(1),
  vehicleModel: z.enum(queryApi.UserResponseVehicleModel),
})

const reservationSchema = z.object({
  state: z.enum(queryApi.MyReservationResponseState),
  message: z.string().optional().nullable(),
  reservation: z.object({
    reservationId: z.number().optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    stationId: z.number().optional(),
    stationName: z.string().optional(),
    stationAddress: z.string().optional(),
  }).nullable().optional(),
})

export type MyReservation = z.infer<typeof reservationSchema>

function selectUser(response: queryApi.ApiResponseDtoUserResponse) {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '내 정보를 불러오지 못했어요.')
  }

  const result = userSchema.safeParse(response.data)
  if (!result.success) throw new Error('내 정보 응답을 확인할 수 없어요.')
  return result.data
}

function selectReservation(response: queryApi.ApiResponseDtoMyReservationResponse): MyReservation {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '예약 현황을 불러오지 못했어요.')
  }

  const result = reservationSchema.safeParse(response.data)
  if (!result.success) throw new Error('예약 현황 응답을 확인할 수 없어요.')
  return result.data
}

export function useMyPageData() {
  const userQuery = queryApi.useGetMe({ query: { select: selectUser, retry: false } })
  const reservationQuery = queryApi.useGetMyReservation({
    query: { select: selectReservation, retry: false },
  })

  return { userQuery, reservationQuery }
}
