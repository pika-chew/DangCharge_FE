export type ChargingHistoryRecord = {
  reservationId: number
  stationId?: number
  stationName?: string
  stationAddress?: string
  vehicleModel?: string
  reservedStartAt?: string
  reservedEndAt?: string
  chargingStartedAt?: string
  completedAt?: string
}

export type ChargingHistoryPage = {
  records: ChargingHistoryRecord[]
  page: number
  size: number
  totalElements: number
}
