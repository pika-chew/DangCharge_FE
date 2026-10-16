import type { SampleMyPage } from '@/types'

// 피그마 화면의 예시 데이터입니다. 사용자·예약·차량 정보는 API 연결 시 교체합니다.
export const sampleMyPage: SampleMyPage = {
  userName: '민준',
  reservation: {
    time: '오늘 14:30',
    stationName: '성수 롯데타워점',
  },
  vehicle: {
    model: '현대 아이오닉 5',
    trim: '롱레인지 AWD',
    year: 2024,
  },
  chargeHistoryCount: 12,
}
