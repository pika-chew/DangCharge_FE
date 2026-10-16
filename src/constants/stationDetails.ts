import type { SampleStationDetail } from '@/types'

// 피그마 화면의 예시 데이터입니다. 충전기 상태와 예약 가능 여부는 API 연결 시 백엔드 응답으로 교체합니다.
export const sampleStationDetails: SampleStationDetail[] = [
  {
    id: 'sample-teheran',
    name: '테헤란로 급속 충전소',
    address: '서울 강남구 테헤란로 152 · 지하 2층',
    distance: '0.4 km',
    operatingHours: '24시간',
    maxPower: '100 kW',
    chargers: [
      { id: 'A-01', speed: '급속', power: '100 kW', pricePerKwh: 320, status: 'available', note: '예상 충전 35분' },
      { id: 'A-02', speed: '급속', power: '100 kW', pricePerKwh: 320, status: 'in-use', note: '14:20 이용 가능' },
      { id: 'A-03', speed: '급속', power: '50 kW', pricePerKwh: 300, status: 'available', note: '예상 충전 50분' },
      { id: 'B-01', speed: '완속', power: '7 kW', pricePerKwh: 280, status: 'available', note: '예상 충전 6시간' },
      { id: 'B-02', speed: '완속', power: '7 kW', pricePerKwh: 280, status: 'maintenance', note: '점검 완료 예정 16:00' },
    ],
  },
]
