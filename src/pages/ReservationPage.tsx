import { useParams } from 'react-router'
import { BackLink } from '@/components/layout'
import { ConfirmReservation, ReservationChargerInfo, ReservationDatePicker, StartTimePicker } from '@/components/reservation'
import { sampleStartTimes, sampleStationDetails } from '@/constants'
import { useReservationSelection } from '@/hooks'

export function ReservationPage() {
  const { chargerId } = useParams()
  const station = sampleStationDetails.find(({ chargers }) => chargers.some(({ id }) => id === chargerId))
  const charger = station?.chargers.find(({ id }) => id === chargerId)
  const { dateOptions, selectedDate, setSelectedDate, selectedStartTime, setSelectedStartTime } = useReservationSelection(sampleStartTimes)

  return (
    <div className="mx-auto w-full max-w-[620px] px-6 py-10">
      <BackLink to={station ? `/stations/${station.id}` : '/'} label={station ? '충전소 상세' : '충전소 목록'} />
      <p className="mt-10 text-label-12 tracking-[0.2em] text-brand">03 RESERVATION</p>
      <h1 className="mt-3 text-display-36 tracking-[-2.52px] text-fg-primary">충전 시간을 선택하세요</h1>

      {station && charger?.status === 'available' ? (
        <article className="mt-4 grid gap-7 rounded-26 border border-line bg-surface p-7 shadow-card">
          <ReservationChargerInfo stationName={station.name} charger={charger} />
          <ReservationDatePicker dateOptions={dateOptions} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <StartTimePicker
            startTimes={sampleStartTimes}
            selectedStartTime={selectedStartTime}
            onSelectStartTime={setSelectedStartTime}
          />
          <ConfirmReservation chargerId={charger.id} date={selectedDate} startTime={selectedStartTime} />
        </article>
      ) : (
        <p className="mt-6 text-body-14 text-fg-secondary">
          {charger ? '지금은 예약할 수 없는 충전기예요.' : '충전기 정보를 찾을 수 없어요.'}
        </p>
      )}
    </div>
  )
}
