import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StationCharger } from '@/types'

type ChargerOptionProps = {
  charger: StationCharger
  selected: boolean
  onSelect: () => void
}

const statusLabels: Record<StationCharger['status'], string> = {
  AVAILABLE: '사용 가능',
  IN_USE: '사용 중',
  OUT_OF_SERVICE: '사용 불가',
  UNKNOWN: '상태 확인 중',
}

export function ChargerOption({ charger, selected, onSelect }: ChargerOptionProps) {
  const isAvailable = charger.status === 'AVAILABLE'
  const selectable = charger.status !== 'OUT_OF_SERVICE'
  const chargingType = charger.chargingType === 'FAST' ? '급속'
    : charger.chargingType === 'SLOW' ? '완속' : '종류 확인 중'

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-18 border p-4 text-left',
        selected ? 'border-brand bg-brand-subtle/50 ring-3 ring-brand/10' : 'border-line bg-surface',
        selectable ? 'cursor-pointer hover:border-brand' : 'cursor-not-allowed opacity-50',
      )}
      type="button"
      disabled={!selectable}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-14',
          charger.chargingType === 'FAST' ? 'bg-brand-subtle text-brand' : 'bg-line/60 text-fg-secondary',
        )}
      >
        <Zap className="size-4" aria-hidden />
      </span>
      <span className="grid min-w-0 flex-1 gap-1">
        <strong className="text-body-14-strong text-fg-primary">충전기 {charger.id}</strong>
        <span className="text-caption-12 text-fg-secondary">
          {chargingType}{charger.maxPowerKw !== undefined ? ` · 최대 ${charger.maxPowerKw} kW` : ''}
        </span>
      </span>
      <span className={cn('shrink-0 text-label-12', isAvailable ? 'text-success' : 'text-fg-tertiary')}>
        {statusLabels[charger.status]}
      </span>
    </button>
  )
}
