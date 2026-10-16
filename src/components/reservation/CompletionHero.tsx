import { Check, Info } from 'lucide-react'
import type { ReservationDetail } from '@/types'

type CompletionHeroProps = {
  status?: ReservationDetail['status']
}

export function CompletionHero({ status }: CompletionHeroProps) {
  const confirmed = status === 'CONFIRMED'
  const charging = status === 'CHARGING'
  const completed = status === 'COMPLETED'
  const active = confirmed || charging || completed

  return (
    <div className="flex flex-col items-center text-center">
      <span className="grid size-16 place-items-center rounded-full bg-brand text-fg-on-brand shadow-card">
        {active ? <Check className="size-7" strokeWidth={2.5} aria-hidden /> : <Info className="size-7" aria-hidden />}
      </span>
      <p className="mt-6 text-body-14-strong text-brand">
        {confirmed ? '예약이 완료되었어요' : charging ? '충전 중이에요' : completed ? '충전이 완료되었어요' : '예약 상태를 확인해주세요'}
      </p>
      <h1 className="mt-3 text-display-36 tracking-[-2.52px] whitespace-pre-line text-fg-primary">
        {confirmed ? '예약 정보를\n확인하세요.' : '마이페이지에서\n현황을 확인하세요.'}
      </h1>
    </div>
  )
}
