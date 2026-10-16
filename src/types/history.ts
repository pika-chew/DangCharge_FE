export type SampleChargeRecord = {
  id: string
  status: 'charging' | 'completed'
  date: string
  reservedAt: string
  // 충전 중이면 예약 기준 완료 예정 시각, 완료되었으면 실제 완료 시각입니다.
  completedAt: string
  stationName: string
  amount: number
}
