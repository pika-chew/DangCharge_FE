import { z } from 'zod'
import { getServerErrorMessage } from './errors'
import { ReservationDetailResponseStatus } from './generated/query'
import type { ApiResponseDtoReservationDetailResponse } from './generated/query'
import type { ReservationDetail } from '@/types'

const detailSchema = z.object({
  reservationId: z.number().int().positive(),
  reservationNumber: z.string().nullish(),
  startAt: z.string().nullish(),
  stationId: z.number().int().nullish(),
  stationName: z.string().nullish(),
  stationAddress: z.string().nullish(),
  chargerId: z.number().int().nullish(),
  status: z.enum(ReservationDetailResponseStatus).nullish(),
})

export function selectReservationDetail(response: ApiResponseDtoReservationDetailResponse): ReservationDetail {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '예약 정보를 불러오지 못했어요.')
  }

  const result = detailSchema.safeParse(response.data)
  if (!result.success) throw new Error('예약 정보 응답을 확인할 수 없어요.')

  const reservation = result.data
  return {
    id: reservation.reservationId,
    number: reservation.reservationNumber ?? undefined,
    startAt: reservation.startAt ?? undefined,
    stationId: reservation.stationId ?? undefined,
    stationName: reservation.stationName ?? undefined,
    stationAddress: reservation.stationAddress ?? undefined,
    chargerId: reservation.chargerId ?? undefined,
    status: reservation.status ?? undefined,
  }
}
