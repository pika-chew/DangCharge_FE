export type StationListItem = {
  id: number
  name: string
  address?: string
  metro?: string
  city?: string
  latitude?: number
  longitude?: number
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
