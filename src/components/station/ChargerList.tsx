import { ChargerOption } from '@/components/station/ChargerOption'
import type { StationCharger } from '@/types'

type ChargerListProps = {
  chargers: StationCharger[]
}

export function ChargerList({ chargers }: ChargerListProps) {
  return (
    <section aria-labelledby="charger-list-title">
      <h2 className="text-body-14-strong text-fg-primary" id="charger-list-title">충전기 현황</h2>
      <p className="mt-1 text-caption-12 text-fg-secondary">현재 상태는 변경될 수 있어요.</p>
      <div className="mt-4 grid gap-3">
        {chargers.length > 0 ? chargers.map((charger) => (
          <ChargerOption key={charger.id} charger={charger} />
        )) : <p className="text-caption-12 text-fg-secondary">표시할 충전기가 없어요.</p>}
      </div>
    </section>
  )
}
