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
  rapidCount?: number
  slowCount?: number
  chargers: StationCharger[]
}

export type SampleChargerStatus = 'available' | 'in-use' | 'maintenance'

export type SampleCharger = {
  id: string
  speed: '급속' | '완속'
  power: string
  pricePerKwh: number
  status: SampleChargerStatus
  note: string
}

export type SampleStationDetail = {
  id: string
  name: string
  address: string
  distance: string
  operatingHours: string
  maxPower: string
  chargers: SampleCharger[]
}
