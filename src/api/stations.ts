import { z } from 'zod'
import { getServerErrorMessage } from './errors'
import type { ApiResponseDtoListStationMarkerResponse, ApiResponseDtoListStationSummaryResponse } from './generated/query'
import type { StationListItem, StationMarker } from '@/types'

const stationFields = {
  stationId: z.number().int(),
  name: z.string().trim().min(1),
}

const optionalCount = z.number().int().nonnegative().nullish()

const markerListSchema = z.array(z.object({
  ...stationFields,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  availableChargerCount: optionalCount,
  distanceMeters: z.number().nonnegative().nullish(),
}))

const searchListSchema = z.array(z.object({
  ...stationFields,
  address: z.string().nullish(),
  metro: z.string().nullish(),
  city: z.string().nullish(),
  rapidCount: optionalCount,
  slowCount: optionalCount,
}))

export function selectStationMarkers(response: ApiResponseDtoListStationMarkerResponse): StationMarker[] {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '주변 충전소를 불러오지 못했어요.')
  }

  const result = markerListSchema.safeParse(response.data)
  if (!result.success) throw new Error('주변 충전소 응답을 확인할 수 없어요.')

  return result.data.map((station) => ({
    id: station.stationId,
    name: station.name,
    latitude: station.latitude,
    longitude: station.longitude,
    availableChargerCount: station.availableChargerCount ?? undefined,
    distanceMeters: station.distanceMeters ?? undefined,
  }))
}

export function selectStationSearchResults(response: ApiResponseDtoListStationSummaryResponse): StationListItem[] {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '충전소를 검색하지 못했어요.')
  }

  const result = searchListSchema.safeParse(response.data)
  if (!result.success) throw new Error('충전소 검색 응답을 확인할 수 없어요.')

  return result.data.map((station) => ({
    id: station.stationId,
    name: station.name,
    address: station.address?.trim() || [station.metro, station.city].filter(Boolean).join(' ') || undefined,
    metro: station.metro?.trim() || undefined,
    city: station.city?.trim() || undefined,
    rapidCount: station.rapidCount ?? undefined,
    slowCount: station.slowCount ?? undefined,
  }))
}
