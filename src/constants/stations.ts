import type { SampleStation } from '@/types'

// 피그마 화면의 예시 데이터입니다. 실제 목록과 예약 가능 여부는 API 연결 시 교체합니다.
export const sampleStations: SampleStation[] = [
  {
    id: 'sample-teheran',
    name: '테헤란로 급속 충전소',
    address: '테헤란로 152 · 지하 2층',
    distance: '0.4 km',
    chargerCount: 6,
    availableCount: 3,
    markerPosition: { left: '44.5%', top: '39%' },
    markerTone: 'brand',
  },
  {
    id: 'sample-gangnam',
    name: '강남역 완속 충전소',
    address: '강남대로 396 · 3층',
    distance: '0.8 km',
    chargerCount: 8,
    availableCount: 5,
    markerPosition: { left: '62.5%', top: '57%' },
    markerTone: 'brand',
  },
  {
    id: 'sample-seolleung',
    name: '선릉 시민주차장',
    address: '삼성로 412 · 지하 1층',
    distance: '1.2 km',
    chargerCount: 4,
    availableCount: 2,
    markerPosition: { left: '30.5%', top: '65%' },
    markerTone: 'muted',
  },
]
