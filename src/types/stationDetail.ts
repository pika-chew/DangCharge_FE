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
