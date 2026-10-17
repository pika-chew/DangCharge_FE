import { z } from 'zod'
import { getServerErrorMessage } from './errors'
import * as queryApi from './generated/query'
import type { ChargingHistoryPage } from '@/types'

const historyPageSchema = z.object({
  content: z.array(z.object({
    reservationId: z.number().int().positive(),
    stationId: z.number().int().positive().nullish(),
    stationName: z.string().trim().min(1).nullish(),
    stationAddress: z.string().trim().min(1).nullish(),
    vehicleModel: z.enum(queryApi.ChargingHistoryResponseVehicleModel).nullish(),
    reservedStartAt: z.string().trim().min(1).nullish(),
    reservedEndAt: z.string().trim().min(1).nullish(),
    chargingStartedAt: z.string().trim().min(1).nullish(),
    completedAt: z.string().trim().min(1).nullish(),
  })).default([]),
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().positive().default(20),
  totalElements: z.number().int().nonnegative().optional(),
})

export function selectChargingHistory(
  response: queryApi.ApiResponseDtoPagedResponseChargingHistoryResponse,
): ChargingHistoryPage {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '충전 내역을 불러오지 못했어요.')
  }

  const result = historyPageSchema.safeParse(response.data)
  if (!result.success) throw new Error('충전 내역 응답을 확인할 수 없어요.')

  const { content, page, size, totalElements } = result.data
  return {
    records: content.map((record) => ({
      reservationId: record.reservationId,
      stationId: record.stationId ?? undefined,
      stationName: record.stationName ?? undefined,
      stationAddress: record.stationAddress ?? undefined,
      vehicleModel: record.vehicleModel ?? undefined,
      reservedStartAt: record.reservedStartAt ?? undefined,
      reservedEndAt: record.reservedEndAt ?? undefined,
      chargingStartedAt: record.chargingStartedAt ?? undefined,
      completedAt: record.completedAt ?? undefined,
    })),
    page,
    size,
    totalElements: totalElements ?? content.length,
  }
}
