import { Link } from 'react-router'
import pinIcon from '@/assets/home/pin.svg'
import type { SampleStation } from '@/types'

type StationCardProps = {
  station: SampleStation
  selected: boolean
}

export function StationCard({ station, selected }: StationCardProps) {
  return (
    <Link
      className={`grid min-h-[106px] gap-3 rounded-[18px] border p-4 text-ink no-underline hover:border-brand ${selected ? 'border-brand' : 'border-[#eeeaf2]'}`}
      to={`/stations/${station.id}`}
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0">
          <h3 className="mb-2 overflow-hidden text-sm leading-5 font-bold text-ellipsis whitespace-nowrap">{station.name}</h3>
          <p className="flex items-center gap-1 text-xs leading-4 text-subtle">
            <img src={pinIcon} alt="" />{station.address}
          </p>
        </div>
        <span className="shrink-0 text-xs leading-4 text-subtle">{station.distance}</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs leading-4 text-[#625b6e] max-[390px]:text-[11px]">
        <span>급속 · 완속 충전기 {station.chargerCount}대</span>
        <strong className="shrink-0 text-success">예약 가능 {station.availableCount}대</strong>
      </div>
    </Link>
  )
}
