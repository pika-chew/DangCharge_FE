import { useState } from 'react'

// API 연결 전 데모용 상태입니다. 충전 종료 요청의 백엔드 응답으로 완료 여부를 판단하도록 바꿔야 합니다.
export function useChargingCompletion() {
  const [completed, setCompleted] = useState(false)

  return { completed, completeCharging: () => setCompleted(true) }
}
