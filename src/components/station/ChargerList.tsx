import { ChargerOption } from '@/components/station/ChargerOption'
import type { StationCharger } from '@/types'

type ChargerListProps = {
  chargers: StationCharger[]
  selectedChargerId?: number
  onSelectCharger: (chargerId: number) => void
}

export function ChargerList({ chargers, selectedChargerId, onSelectCharger }: ChargerListProps) {
  return (
    <section aria-labelledby="charger-list-title">
      <h2 className="text-body-14-strong text-fg-primary" id="charger-list-title">충전기를 선택해주세요</h2>
      <p className="mt-1 text-caption-12 text-fg-secondary">충전기를 선택하면 예약 가능한 시간을 확인할 수 있어요.</p>
      <div className="mt-4 grid gap-3">
        {chargers.length > 0 ? chargers.map((charger) => (
          <ChargerOption
            key={charger.id}
            charger={charger}
            selected={charger.id === selectedChargerId}
            onSelect={() => onSelectCharger(charger.id)}
          />
        )) : <p className="text-caption-12 text-fg-secondary">표시할 충전기가 없어요.</p>}
      </div>
    </section>
  )
}
