import { loadNaverMaps } from '@/lib/naverMaps'
import type { StationCoordinates, StationListItem } from '@/types'

export function getStationAddress(station: StationListItem) {
  const address = station.address?.trim()
  // 시군구 중심점을 실제 충전소 위치로 표시하지 않습니다.
  if (!address) return ''
  // 이미 시도로 시작하는 전체 주소에는 별도 지역 필드를 중복으로 붙이지 않습니다.
  if (/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충청북|충북|충청남|충남|전라북|전북|전라남|전남|경상북|경북|경상남|경남|제주)(특별자치시|특별시|광역시|특별자치도|도)?\s/.test(address)) {
    return address.replace(/\s+/g, ' ')
  }
  const regions = [station.metro, station.city]
    .filter((region): region is string => Boolean(region && !address.includes(region)))
  return [...regions, address].join(' ').replace(/\s+/g, ' ').trim()
}

let activeRequests = 0
const waitingRequests: (() => void)[] = []

async function acquireRequest() {
  if (activeRequests < 4) {
    activeRequests += 1
    return
  }
  await new Promise<void>((resolve) => { waitingRequests.push(resolve) })
}

function releaseRequest() {
  const next = waitingRequests.shift()
  if (next) next()
  else activeRequests -= 1
}

export async function geocodeAddress(address: string): Promise<StationCoordinates> {
  if (!address) throw new Error('충전소 주소가 없어 위치를 찾을 수 없어요.')
  const maps = await loadNaverMaps()
  const service = maps.Service
  if (!service) throw new Error('네이버 지도 Geocoder를 불러오지 못했어요.')

  await acquireRequest()
  try {
    return await new Promise<StationCoordinates>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error('주소의 위치를 찾는 시간이 초과됐어요. 다시 시도해주세요.'))
      }, 15_000)
      try {
        service.geocode({ query: address }, (status, response) => {
          window.clearTimeout(timeout)
          if (status !== service.Status.OK) {
            reject(new Error('주소 변환에 실패했어요. 네이버 Geocoding 사용 설정과 이용 한도를 확인해주세요.'))
            return
          }
          const result = response.v2?.addresses?.[0]
          if (!result) {
            reject(new Error('네이버 지도에서 해당 충전소 주소를 찾지 못했어요.'))
            return
          }
          const lat = Number(result.y)
          const lng = Number(result.x)
          if (!result.y?.trim() || !result.x?.trim()
            || !Number.isFinite(lat) || !Number.isFinite(lng)
            || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            reject(new Error('주소 변환 결과의 좌표를 확인할 수 없어요.'))
            return
          }
          resolve({ lat, lng })
        })
      } catch (error) {
        window.clearTimeout(timeout)
        reject(error)
      }
    })
  } finally {
    releaseRequest()
  }
}
