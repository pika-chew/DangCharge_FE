import { BatteryCharging, Clock, MapPin, Zap } from 'lucide-react'
import { StatGroup, StatItem } from '@/components/common'
import type { SampleStationDetail } from '@/types'

type StationSummaryProps = {
  station: SampleStationDetail
}

export function StationSummary({ station }: StationSummaryProps) {
  const availableCount = station.chargers.filter((charger) => charger.status === 'available').length
  const fastCount = station.chargers.filter((charger) => charger.speed === '급속').length
  const slowCount = station.chargers.length - fastCount

  return (
    <section aria-labelledby="station-name">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-success-subtle px-3 py-1.5 text-label-12 text-success">예약 가능 {availableCount}대</span>
        <span className="text-caption-12 text-fg-secondary">{station.distance}</span>
      </div>
      <h1 className="mt-6 text-[30px] leading-9 font-bold tracking-[-1.5px] text-fg-primary" id="station-name">{station.name}</h1>
      <p className="mt-3 flex items-center gap-1 text-body-14 text-fg-secondary">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {station.address}
      </p>

      <StatGroup className="mt-8">
        <StatItem icon={BatteryCharging} value={`급속 ${fastCount}대`} label={`완속 ${slowCount}대`} />
        <StatItem icon={Clock} value={station.operatingHours} label="운영" />
        <StatItem icon={Zap} value={`최대 ${station.maxPower}`} label="출력" />
      </StatGroup>
    </section>
  )
}
