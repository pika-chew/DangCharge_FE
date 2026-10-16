import { Link } from 'react-router'
import pinIcon from '@/assets/home/pin.svg'
import type { StationListItem } from '@/types'

type StationCardProps = {
  station: StationListItem
  selected: boolean
  onSelect: (id: number) => void
}

function formatDistance(meters: number) {
  return meters < 1000 ? `${meters.toLocaleString('ko-KR')} m` : `${(meters / 1000).toFixed(1)} km`
}

export function StationCard({ station, selected, onSelect }: StationCardProps) {
  const chargerCounts = [
    station.rapidCount !== undefined ? `급속 ${station.rapidCount}대` : null,
    station.slowCount !== undefined ? `완속 ${station.slowCount}대` : null,
  ].filter(Boolean).join(' · ')

  return (
    <article className={`overflow-hidden rounded-18 border bg-surface text-fg-primary ${selected ? 'border-brand' : 'border-line hover:border-brand'}`}>
      <button
        type="button"
        className="grid min-h-[106px] w-full cursor-pointer gap-3 p-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        aria-pressed={selected}
        onClick={() => onSelect(station.id)}
      >
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <h3 className="mb-2 overflow-hidden text-body-14-strong text-ellipsis whitespace-nowrap">{station.name}</h3>
            {station.address && (
              <p className="flex items-center gap-1 text-caption-12 text-fg-secondary">
                <img src={pinIcon} alt="" />{station.address}
              </p>
            )}
          </div>
          {station.distanceMeters !== undefined && (
            <span className="shrink-0 text-caption-12 text-fg-secondary">{formatDistance(station.distanceMeters)}</span>
          )}
        </div>
        {(chargerCounts || station.availableChargerCount !== undefined) && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-caption-12 text-fg-secondary">
            {chargerCounts && <span>{chargerCounts}</span>}
            {station.availableChargerCount !== undefined && (
              <strong className={station.availableChargerCount > 0 ? 'text-success' : 'text-fg-secondary'}>
                사용 가능 {station.availableChargerCount}대
              </strong>
            )}
          </div>
        )}
      </button>
      <Link
        className="block border-t border-line px-4 py-2 text-right text-caption-12 text-brand hover:underline"
        to={`/stations/${station.id}`}
        aria-label={`${station.name} 상세 보기`}
      >
        상세 보기
      </Link>
    </article>
  )
}
