import { ChargerOption } from '@/components/station/ChargerOption'
import type { SampleCharger } from '@/types'

type ChargerListProps = {
  chargers: SampleCharger[]
  selectedChargerId?: string
  onSelectCharger: (chargerId: string) => void
}

export function ChargerList({ chargers, selectedChargerId, onSelectCharger }: ChargerListProps) {
  return (
    <section aria-labelledby="charger-list-title">
      <h2 className="text-body-14-strong text-fg-primary" id="charger-list-title">충전기를 선택해주세요</h2>
      <p className="mt-1 text-caption-12 text-fg-secondary">예약 가능한 충전기만 예약할 수 있어요.</p>
      <div className="mt-4 grid gap-3">
        {chargers.map((charger) => (
          <ChargerOption
            key={charger.id}
            charger={charger}
            selected={charger.id === selectedChargerId}
            onSelect={() => onSelectCharger(charger.id)}
          />
        ))}
      </div>
    </section>
  )
}
