export type SampleStation = {
  id: string
  name: string
  address: string
  distance: string
  chargerCount: number
  availableCount: number
  markerPosition: { left: string; top: string }
  markerTone: 'brand' | 'muted'
}
