import { Check, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SampleCharger, SampleChargerStatus } from '@/types'

type ChargerOptionProps = {
  charger: SampleCharger
  selected: boolean
  onSelect: () => void
}

const unavailableLabels: Record<Exclude<SampleChargerStatus, 'available'>, string> = {
  'in-use': '사용 중',
  maintenance: '점검 중',
}

export function ChargerOption({ charger, selected, onSelect }: ChargerOptionProps) {
  const available = charger.status === 'available'

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-18 border p-4 text-left',
        selected ? 'border-brand bg-brand-subtle/50 ring-3 ring-brand/10' : 'border-line bg-surface',
        available ? 'cursor-pointer hover:border-brand' : 'cursor-not-allowed opacity-50',
      )}
      type="button"
      disabled={!available}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-14',
          charger.speed === '급속' ? 'bg-brand-subtle text-brand' : 'bg-line/60 text-fg-secondary',
        )}
      >
        <Zap className="size-4" aria-hidden />
      </span>
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex items-baseline gap-2">
          <strong className="text-body-14-strong text-fg-primary">{charger.id}</strong>
          <span className="text-caption-12 text-fg-secondary">{charger.speed} · {charger.power}</span>
        </span>
        <span className="truncate text-caption-12 text-fg-secondary">
          {charger.pricePerKwh.toLocaleString('ko-KR')}원/kWh · {charger.note}
        </span>
      </span>
      {available ? (
        <span className="flex shrink-0 items-center gap-1 text-label-12 text-success">
          {selected && <Check className="size-3.5" aria-hidden />}
          예약 가능
        </span>
      ) : (
        <span className="shrink-0 text-caption-12 text-fg-tertiary">{unavailableLabels[charger.status]}</span>
      )}
    </button>
  )
}
