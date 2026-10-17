import { useEffect, useRef, useState } from 'react'
import { loadNaverMaps } from '@/lib/naverMaps'
import type {
  NaverEventListener, NaverMap, NaverMapsApi, NaverMarker,
} from '@/lib/naverMaps'
import type { StationCoordinates, StationListItem, StationMarker } from '@/types'

type StationMapProps = {
  query: string
  radius: number
  userLocation: StationCoordinates | null
  stations: StationMarker[]
  selectedStation?: StationListItem
  focusedStationId?: number
  isLoading: boolean
  loadingMessage: string
  error?: string
  warning?: string
  onRetry: () => void
  isRetrying: boolean
  canRetry: boolean
  onSelectStation: (id: number) => void
}

type MarkerEntry = {
  marker: NaverMarker
  listener: NaverEventListener
}

const defaultCenter = { lat: 37.5666103, lng: 126.9783882 }

function stationMarkerContent(selected: boolean) {
  const size = selected ? 34 : 28
  const background = selected ? '#7252e8' : '#ffffff'
  const color = selected ? '#ffffff' : '#7252e8'

  return `<div style="box-sizing:border-box;display:grid;place-items:center;width:${size}px;height:${size}px;border:2px solid #7252e8;border-radius:50% 50% 50% 0;background:${background};color:${color};font-size:16px;font-weight:700;box-shadow:0 3px 8px rgba(30,22,55,.22);transform:rotate(-45deg)"><span style="transform:rotate(45deg)">⚡</span></div>`
}

function userMarkerContent() {
  return '<div style="box-sizing:border-box;width:20px;height:20px;border:4px solid #fff;border-radius:50%;background:#2f80ed;box-shadow:0 2px 8px rgba(20,72,140,.45)"></div>'
}

export function StationMap({
  query, radius, userLocation, stations, selectedStation, focusedStationId,
  isLoading, loadingMessage, error, warning, onRetry, isRetrying, canRetry, onSelectStation,
}: StationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<NaverMap | null>(null)
  const stationMarkersRef = useRef<MarkerEntry[]>([])
  const userMarkerRef = useRef<NaverMarker | null>(null)
  const [mapsApi, setMapsApi] = useState<NaverMapsApi | null>(null)
  const [sdkError, setSdkError] = useState<string>()
  const [sdkRetryable, setSdkRetryable] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    let active = true
    const previousAuthFailureHandler = window.navermap_authFailure
    const handleAuthFailure = () => {
      if (!active) return
      setSdkRetryable(false)
      setSdkError('네이버 지도 인증에 실패했어요. Client ID와 Web 서비스 URL을 확인해주세요.')
    }
    window.navermap_authFailure = handleAuthFailure

    void loadNaverMaps()
      .then((api) => { if (active) setMapsApi(api) })
      .catch((loadError: unknown) => {
        if (!active) return
        setSdkRetryable(true)
        setSdkError(loadError instanceof Error ? loadError.message : '네이버 지도를 불러오지 못했어요.')
      })

    return () => {
      active = false
      if (window.navermap_authFailure === handleAuthFailure) {
        window.navermap_authFailure = previousAuthFailureHandler
      }
    }
  }, [loadAttempt])

  useEffect(() => {
    if (!mapsApi || !containerRef.current || mapRef.current) return
    const center = userLocation
      ? { latitude: userLocation.lat, longitude: userLocation.lng }
      : stations[0] ?? { latitude: defaultCenter.lat, longitude: defaultCenter.lng }
    mapRef.current = new mapsApi.Map(containerRef.current, {
      center: new mapsApi.LatLng(center.latitude, center.longitude),
      zoom: userLocation ? 14 : 12,
    })
  }, [mapsApi, stations, userLocation])

  useEffect(() => {
    const container = containerRef.current
    const map = mapRef.current
    if (!container || !map || !mapsApi || !window.ResizeObserver) return

    const observer = new ResizeObserver(([entry]) => {
      map.setSize(new mapsApi.Size(entry.contentRect.width, entry.contentRect.height))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [mapsApi])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapsApi) return

    userMarkerRef.current?.setMap(null)
    userMarkerRef.current = null
    if (!userLocation) return

    userMarkerRef.current = new mapsApi.Marker({
      map,
      position: new mapsApi.LatLng(userLocation.lat, userLocation.lng),
      icon: {
        content: userMarkerContent(),
        anchor: new mapsApi.Point(10, 10),
      },
      zIndex: 200,
    })

    return () => {
      userMarkerRef.current?.setMap(null)
      userMarkerRef.current = null
    }
  }, [mapsApi, userLocation])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapsApi) return

    for (const { marker, listener } of stationMarkersRef.current) {
      mapsApi.Event.removeListener(listener)
      marker.setMap(null)
    }

    stationMarkersRef.current = stations.map((station) => {
      const selected = station.id === selectedStation?.id
      const size = selected ? 34 : 28
      const marker = new mapsApi.Marker({
        map,
        position: new mapsApi.LatLng(station.latitude, station.longitude),
        icon: {
          content: stationMarkerContent(selected),
          anchor: new mapsApi.Point(size / 2, size),
        },
        zIndex: selected ? 100 : 10,
      })
      const listener = mapsApi.Event.addListener(marker, 'click', () => onSelectStation(station.id))
      return { marker, listener }
    })

    return () => {
      for (const { marker, listener } of stationMarkersRef.current) {
        mapsApi.Event.removeListener(listener)
        marker.setMap(null)
      }
      stationMarkersRef.current = []
    }
  }, [mapsApi, onSelectStation, selectedStation?.id, stations])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapsApi) return

    const focusedStation = stations.find(({ id }) => id === focusedStationId)
    if (focusedStation) {
      map.setCenter(new mapsApi.LatLng(focusedStation.latitude, focusedStation.longitude))
      map.setZoom(16)
      return
    }

    // 검색 결과를 기다리는 동안 현재 위치로 되돌아가지 않습니다.
    if (query && stations.length === 0) return

    const positions = [
      ...(!query && userLocation ? [new mapsApi.LatLng(userLocation.lat, userLocation.lng)] : []),
      ...stations.map((station) => new mapsApi.LatLng(station.latitude, station.longitude)),
    ]
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setCenter(positions[0])
      map.setZoom(14)
      return
    }

    const bounds = new mapsApi.LatLngBounds(positions[0], positions[0])
    positions.slice(1).forEach((position) => bounds.extend(position))
    map.fitBounds(bounds)
  }, [focusedStationId, mapsApi, query, stations, userLocation])

  const visibleError = sdkError ?? error
  const sdkLoading = !mapsApi && !sdkError

  return (
    <section
      className="relative h-[430px] overflow-hidden rounded-26 border border-line bg-[#efedf2] min-[761px]:h-[512px]"
      aria-label="충전소 지도"
      aria-busy={sdkLoading || isLoading || isRetrying}
    >
      <div ref={containerRef} className="h-full w-full" />
      <span className="absolute top-6 left-6 z-10 rounded-14 bg-surface px-3 py-2 text-xs font-semibold leading-4 shadow-[0_1px_3px_rgb(0_0_0/10%),0_1px_2px_-1px_rgb(0_0_0/10%)]">
        {query ? `검색: ${query}` : `주변 반경 ${(radius / 1000).toLocaleString('ko-KR')} km`}
      </span>

      {warning && !visibleError && (
        <p role="status" className="absolute right-6 bottom-6 left-6 z-10 rounded-14 bg-surface/90 px-3 py-2 text-caption-12 text-fg-secondary shadow-card">
          {warning}
        </p>
      )}

      {(sdkLoading || isLoading || visibleError) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface/85 px-6 text-center backdrop-blur-[2px]">
          <strong className="text-heading-20 text-fg-primary">
            {visibleError ? '지도를 표시할 수 없어요' : '지도를 불러오는 중'}
          </strong>
          <p className="text-body-14 text-fg-secondary" role={visibleError ? 'alert' : 'status'}>
            {visibleError ?? (sdkLoading ? '네이버 지도 API를 준비하고 있어요.' : loadingMessage)}
          </p>
          {visibleError && (sdkError ? sdkRetryable : canRetry) && (
            <button
              type="button"
              className="text-body-14 text-brand underline disabled:opacity-50"
              disabled={isRetrying}
              onClick={() => {
                if (sdkError) {
                  setSdkRetryable(false)
                  setSdkError(undefined)
                  setLoadAttempt((attempt) => attempt + 1)
                } else onRetry()
              }}
            >
              {isRetrying ? '확인 중…' : '다시 시도'}
            </button>
          )}
        </div>
      )}

      {userLocation && !visibleError && !warning && (
        <span className="absolute bottom-6 left-6 z-10 rounded-14 bg-surface/90 px-3 py-2 text-caption-12 text-fg-secondary shadow-card">
          현재 위치
        </span>
      )}
    </section>
  )
}
