export type NaverMap = {
  setCenter: (position: NaverLatLng) => void
  setZoom: (zoom: number) => void
  fitBounds: (bounds: NaverLatLngBounds) => void
  setSize: (size: NaverSize) => void
}

export type NaverLatLng = object
export type NaverLatLngBounds = {
  extend: (position: NaverLatLng) => void
}
export type NaverSize = object
export type NaverMarker = {
  setMap: (map: NaverMap | null) => void
}
export type NaverEventListener = object

export type NaverMapsApi = {
  Map: new (container: HTMLElement, options: { center: NaverLatLng; zoom: number }) => NaverMap
  LatLng: new (latitude: number, longitude: number) => NaverLatLng
  LatLngBounds: new (southWest: NaverLatLng, northEast: NaverLatLng) => NaverLatLngBounds
  Size: new (width: number, height: number) => NaverSize
  Point: new (x: number, y: number) => object
  Marker: new (options: {
    map: NaverMap
    position: NaverLatLng
    icon?: { content: string; anchor: object }
    zIndex?: number
  }) => NaverMarker
  Event: {
    addListener: (target: object, eventName: string, listener: () => void) => NaverEventListener
    removeListener: (listener: NaverEventListener) => void
  }
  Service?: {
    Status: { OK: number }
    geocode: (options: { query: string }, callback: (
      status: number,
      response: { v2?: { addresses?: { x: string; y: string }[] } },
    ) => void) => void
  }
}

declare global {
  interface Window {
    naver?: { maps: NaverMapsApi }
    navermap_authFailure?: () => void
    dangChargeMapsReady?: () => void
  }
}

const scriptId = 'naver-maps-sdk'
let loadPromise: Promise<NaverMapsApi> | null = null

export function loadNaverMaps() {
  if (window.naver?.maps.Service) return Promise.resolve(window.naver.maps)
  if (loadPromise) return loadPromise

  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID?.trim()
  if (!clientId) return Promise.reject(new Error('네이버 지도 Client ID가 설정되지 않았어요.'))

  loadPromise = new Promise<NaverMapsApi>((resolve, reject) => {
    const script = document.createElement('script')
    document.getElementById(scriptId)?.remove()
    const timeout = window.setTimeout(() => {
      fail('네이버 지도 API 준비 시간이 초과됐어요. 다시 시도해주세요.')
    }, 15_000)

    function cleanup() {
      window.clearTimeout(timeout)
      delete window.dangChargeMapsReady
    }

    function fail(message: string) {
      cleanup()
      loadPromise = null
      script.remove()
      reject(new Error(message))
    }

    // SDK의 load 이벤트보다 늦게 준비될 수 있는 Geocoder까지 기다립니다.
    window.dangChargeMapsReady = () => {
      if (!window.naver?.maps.Service) {
        fail('네이버 지도 Geocoder를 초기화하지 못했어요.')
        return
      }
      cleanup()
      resolve(window.naver.maps)
    }
    script.addEventListener('error', () => {
      fail('네이버 지도 API를 불러오지 못했어요.')
    }, { once: true })

    script.id = scriptId
    script.async = true
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&submodules=geocoder&callback=dangChargeMapsReady`
    document.head.append(script)
  })

  return loadPromise
}
