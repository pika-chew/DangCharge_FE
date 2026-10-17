export type StationCharger = {
  id: number
  chargingType?: 'FAST' | 'SLOW'
  maxPowerKw?: number
  status: 'AVAILABLE' | 'IN_USE' | 'OUT_OF_SERVICE' | 'UNKNOWN'
}

export type StationDetail = {
  id: number
  name: string
  address?: string
  latitude?: number
  longitude?: number
  rapidCount?: number
  slowCount?: number
  chargers: StationCharger[]
}
