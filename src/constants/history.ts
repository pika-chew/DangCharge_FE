import type { SampleChargeRecord } from '@/types'

// 피그마 화면의 예시 데이터입니다. 실제 충전 내역과 충전 상태는 API 연결 시 교체합니다.
export const sampleChargeRecords: SampleChargeRecord[] = [
  {
    id: 'sample-record-2',
    status: 'charging',
    date: '2025년 10월 6일',
    reservedAt: '18:30',
    completedAt: '19:30',
    stationName: '테헤란로',
    amount: 5120,
  },
  {
    id: 'sample-record-1',
    status: 'completed',
    date: '2025년 10월 5일',
    reservedAt: '17:30',
    completedAt: '18:30',
    stationName: '테헤란로',
    amount: 10368,
  },
]
