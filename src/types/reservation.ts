export type ReservationDateOption = {
  value: string
  dayLabel: string
  dayOfMonth: number
  fullLabel: string
}

export type ReservationSlot = {
  chargerId: number
  startAt: string
  endAt: string
  status: 'ENABLE' | 'DISABLE'
}

export type ReservationDetail = {
  id: number
  number?: string
  startAt?: string
  stationId?: number
  stationName?: string
  stationAddress?: string
  chargerId?: number
  status?: 'CONFIRMED' | 'CHARGING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
}
