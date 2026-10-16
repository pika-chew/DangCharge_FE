import { useSearchParams } from 'react-router'
import { BackLink } from '@/components/layout'
import { CompletionHero, ReservationInfoCard } from '@/components/reservation'
import { sampleReservationNumber, sampleStationDetails } from '@/constants'
import { useChargingCompletion } from '@/hooks'
import { formatRelativeDate } from '@/lib/date'

export function ReservationCompletePage() {
  const [searchParams] = useSearchParams()
  const chargerId = searchParams.get('chargerId')
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const station = sampleStationDetails.find(({ chargers }) => chargers.some(({ id }) => id === chargerId))
  const { completed, completeCharging } = useChargingCompletion()

  if (!station || !date || !time) {
    return (
      <div className="mx-auto w-full max-w-[620px] px-6 py-10">
        <BackLink to="/" label="충전소 목록" />
        <p className="mt-10 text-body-14 text-fg-secondary">예약 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-brand-subtle/60">
      <div className="mx-auto w-full max-w-[620px] px-6 py-16">
        <CompletionHero chargingCompleted={completed} />
        <div className="mt-10">
          <ReservationInfoCard
            stationName={station.name}
            address={station.address}
            startTimeLabel={`${formatRelativeDate(date)} ${time}`}
            reservationNumber={sampleReservationNumber}
            chargingCompleted={completed}
            onCompleteCharging={completeCharging}
          />
        </div>
      </div>
    </div>
  )
}
