import { BatteryCharging, MapPin, PlugZap, Zap } from 'lucide-react'
import { StatGroup, StatItem } from '@/components/common'
import type { StationDetail } from '@/types'

type StationSummaryProps = {
  station: StationDetail
}

export function StationSummary({ station }: StationSummaryProps) {
  const availableCount = station.chargers.filter((charger) => charger.status === 'AVAILABLE').length
  const fastCount = station.rapidCount ?? station.chargers.filter((charger) => charger.chargingType === 'FAST').length
  const slowCount = station.slowCount ?? station.chargers.filter((charger) => charger.chargingType === 'SLOW').length

  return (
    <section aria-labelledby="station-name">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-success-subtle px-3 py-1.5 text-label-12 text-success">사용 가능 {availableCount}대</span>
      </div>
      <h1 className="mt-6 text-[30px] leading-9 font-bold tracking-[-1.5px] text-fg-primary" id="station-name">{station.name}</h1>
      <p className="mt-3 flex items-center gap-1 text-body-14 text-fg-secondary">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {station.address ?? '주소 정보가 없어요.'}
      </p>

      <StatGroup className="mt-8">
        <StatItem icon={BatteryCharging} value={`${availableCount}대`} label="사용 가능" />
        <StatItem icon={Zap} value={`${fastCount}대`} label="급속" />
        <StatItem icon={PlugZap} value={`${slowCount}대`} label="완속" />
      </StatGroup>
    </section>
  )
}
