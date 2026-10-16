import { useEffect, useState } from 'react'
import type { StationCoordinates } from '@/types'

type DeviceLocationState = {
  coordinates: StationCoordinates | null
  isLocating: boolean
  error?: string
}

function getInitialState(): DeviceLocationState {
  if (!window.isSecureContext) {
    return { coordinates: null, isLocating: false, error: '현재 위치를 확인하려면 HTTPS로 접속해주세요.' }
  }
  if (!navigator.geolocation) {
    return { coordinates: null, isLocating: false, error: '이 브라우저는 위치 확인을 지원하지 않아요. 검색으로 충전소를 찾아주세요.' }
  }

  return { coordinates: null, isLocating: true }
}

export function useDeviceLocation() {
  const [location, setLocation] = useState<DeviceLocationState>(getInitialState)
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    if (!window.isSecureContext || !navigator.geolocation) return
    let active = true

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!active) return
        setLocation({
          coordinates: { lat: coords.latitude, lng: coords.longitude },
          isLocating: false,
        })
      },
      ({ code }) => {
        if (!active) return
        const error = code === 1
          ? '위치 권한이 꺼져 있어요. 브라우저에서 위치 권한을 허용하거나 검색으로 충전소를 찾아주세요.'
          : code === 3
            ? '위치 확인 시간이 초과됐어요. 다시 시도하거나 검색으로 충전소를 찾아주세요.'
            : '현재 위치를 확인할 수 없어요. 기기의 위치 설정을 확인하거나 검색으로 충전소를 찾아주세요.'
        setLocation({ coordinates: null, isLocating: false, error })
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    )

    return () => { active = false }
  }, [requestId])

  function requestLocation() {
    setLocation(getInitialState())
    setRequestId((previous) => previous + 1)
  }

  return { ...location, requestLocation }
}
