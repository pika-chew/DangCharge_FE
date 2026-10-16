import { Zap } from 'lucide-react'
import type { SampleCharger } from '@/types'

type ReservationChargerInfoProps = {
  stationName: string
  charger: SampleCharger
}

export function ReservationChargerInfo({ stationName, charger }: ReservationChargerInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-14 bg-brand-subtle text-brand">
        <Zap className="size-5 fill-current" aria-hidden />
      </span>
      <div className="min-w-0">
        <h2 className="truncate text-body-14-strong text-fg-primary">{stationName}</h2>
        <p className="mt-1 text-caption-12 text-fg-secondary">
          {charger.id} · {charger.power} · {charger.pricePerKwh.toLocaleString('ko-KR')}원/kWh
        </p>
      </div>
    </div>
  )
}
