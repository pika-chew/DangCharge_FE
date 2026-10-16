import { Check } from 'lucide-react'

type CompletionHeroProps = {
  chargingCompleted: boolean
}

export function CompletionHero({ chargingCompleted }: CompletionHeroProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="grid size-16 place-items-center rounded-full bg-brand text-fg-on-brand shadow-card">
        <Check className="size-7" strokeWidth={2.5} aria-hidden />
      </span>
      <p className="mt-6 text-body-14-strong text-brand">
        {chargingCompleted ? '충전이 완료되었어요' : '예약이 완료되었어요'}
      </p>
      <h1 className="mt-3 text-display-36 tracking-[-2.52px] whitespace-pre-line text-fg-primary">
        {chargingCompleted ? '충전 내역에서\n이용 기록을 확인하세요.' : '도착하면 바로\n충전을 시작하세요.'}
      </h1>
    </div>
  )
}
