import { useParams } from 'react-router'
import { BackLink } from '@/components/layout'
import { ChargerList, ReserveAction, StationSummary } from '@/components/station'
import { sampleStationDetails } from '@/constants'
import { useChargerSelection } from '@/hooks'

export function StationDetailPage() {
  const { stationId } = useParams()
  const station = sampleStationDetails.find(({ id }) => id === stationId)
  const { selectedCharger, setSelectedChargerId } = useChargerSelection(station?.chargers ?? [])

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-10">
      <BackLink to="/" label="충전소 목록" />
      {station ? (
        <article className="mt-8 grid gap-10 rounded-26 border border-line bg-surface p-8 shadow-card">
          <StationSummary station={station} />
          <ChargerList
            chargers={station.chargers}
            selectedChargerId={selectedCharger?.id}
            onSelectCharger={setSelectedChargerId}
          />
          <ReserveAction chargerId={selectedCharger?.id} />
        </article>
      ) : (
        <p className="mt-8 text-body-14 text-fg-secondary">충전소 정보를 찾을 수 없어요.</p>
      )}
    </div>
  )
}
