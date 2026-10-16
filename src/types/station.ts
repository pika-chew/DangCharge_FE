export type StationListItem = {
  id: number
  name: string
  address?: string
  metro?: string
  city?: string
  distanceMeters?: number
  rapidCount?: number
  slowCount?: number
  availableChargerCount?: number
}

export type StationMarker = StationListItem & {
  latitude: number
  longitude: number
}

export type StationCoordinates = {
  lat: number
  lng: number
}

export type StationSearchArea = StationCoordinates & {
  radius: number
}
