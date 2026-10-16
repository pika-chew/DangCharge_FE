import { z } from 'zod'
import { getServerErrorMessage, queryApi } from '@/api'
import type { VehicleModelOption } from '@/types'

const vehicleModelsSchema = z.array(z.object({
  code: z.enum(queryApi.VehicleModelResponseCode),
  label: z.string().trim().min(1),
}))

function selectVehicleModels(response: queryApi.ApiResponseDtoListVehicleModelResponse): VehicleModelOption[] {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '차종 목록을 불러오지 못했어요.')
  }

  const result = vehicleModelsSchema.safeParse(response.data)
  if (!result.success) throw new Error('차종 목록 응답을 확인할 수 없어요.')

  return result.data.map(({ code, label }) => ({ value: code, label }))
}

export function useVehicleModels(enabled = true) {
  return queryApi.useGetVehicleModels({
    query: {
      select: selectVehicleModels,
      retry: false,
      enabled,
    },
  })
}
