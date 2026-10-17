import { z } from 'zod'
import { getServerErrorMessage } from './errors'
import { AvailableSlotResponseStatus, ChargerResponseChargingType, ChargerResponseStatus } from './generated/query'
import type { ApiResponseDtoListAvailableSlotResponse, ApiResponseDtoListStationMarkerResponse, ApiResponseDtoListStationSummaryResponse, ApiResponseDtoStationDetailResponse } from './generated/query'
import type { ReservationSlot, StationDetail, StationListItem } from '@/types'

const stationFields = {
  stationId: z.number().int(),
  name: z.string().trim().min(1),
}

const optionalCount = z.number().int().nonnegative().nullish()

const markerListSchema = z.array(z.object({
  ...stationFields,
  address: z.string().nullish(),
  metro: z.string().nullish(),
  city: z.string().nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
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

const stationDetailSchema = z.object({
  ...stationFields,
  address: z.string().nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  rapidCount: optionalCount,
  slowCount: optionalCount,
  chargers: z.array(z.object({
    chargerId: z.number().int(),
    chargingType: z.enum(ChargerResponseChargingType).nullish(),
    maxPowerKw: z.number().nonnegative().nullish(),
    status: z.enum(ChargerResponseStatus).nullish(),
  })).nullish(),
})

const availabilitySchema = z.array(z.object({
  chargerId: z.number().int(),
  startAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  endAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  status: z.enum(AvailableSlotResponseStatus),
}))

export function selectStationMarkers(response: ApiResponseDtoListStationMarkerResponse): StationListItem[] {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '주변 충전소를 불러오지 못했어요.')
  }

  const result = markerListSchema.safeParse(response.data)
  if (!result.success) throw new Error('주변 충전소 응답을 확인할 수 없어요.')

  return result.data.map((station) => ({
    id: station.stationId,
    name: station.name,
    address: station.address?.trim() || undefined,
    metro: station.metro?.trim() || undefined,
    city: station.city?.trim() || undefined,
    latitude: station.latitude ?? undefined,
    longitude: station.longitude ?? undefined,
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
    address: station.address?.trim() || undefined,
    metro: station.metro?.trim() || undefined,
    city: station.city?.trim() || undefined,
    rapidCount: station.rapidCount ?? undefined,
    slowCount: station.slowCount ?? undefined,
  }))
}

export function selectStationDetail(response: ApiResponseDtoStationDetailResponse): StationDetail {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '충전소 정보를 불러오지 못했어요.')
  }

  const result = stationDetailSchema.safeParse(response.data)
  if (!result.success) throw new Error('충전소 상세 응답을 확인할 수 없어요.')

  const station = result.data
  return {
    id: station.stationId,
    name: station.name,
    address: station.address?.trim() || undefined,
    latitude: station.latitude ?? undefined,
    longitude: station.longitude ?? undefined,
    rapidCount: station.rapidCount ?? undefined,
    slowCount: station.slowCount ?? undefined,
    chargers: (station.chargers ?? []).map((charger) => ({
      id: charger.chargerId,
      chargingType: charger.chargingType ?? undefined,
      maxPowerKw: charger.maxPowerKw ?? undefined,
      status: charger.status ?? 'UNKNOWN',
    })),
  }
}

export function selectAvailability(response: ApiResponseDtoListAvailableSlotResponse): ReservationSlot[] {
  if (response.success !== true) {
    throw new Error(getServerErrorMessage(response) ?? '예약 가능 시간을 불러오지 못했어요.')
  }

  const result = availabilitySchema.safeParse(response.data)
  if (!result.success) throw new Error('예약 가능 시간 응답을 확인할 수 없어요.')
  return result.data
}
