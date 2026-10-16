import { useState } from 'react'
import { formatTime } from '@/lib/date'
import type { SampleChargeRecord } from '@/types'

// API 연결 전 데모용 상태입니다. 충전 종료 요청의 백엔드 응답으로 내역을 갱신하도록 바꿔야 합니다.
export function useChargeRecords(initialRecords: SampleChargeRecord[]) {
  const [records, setRecords] = useState(initialRecords)

  const completeCharging = (recordId: string) => {
    const completedAt = formatTime(new Date())

    setRecords((current) => current.map((record) => (
      record.id === recordId ? { ...record, status: 'completed' as const, completedAt } : record
    )))
  }

  return { records, completeCharging }
}
