import { isAxiosError } from 'axios'
import { useParams } from 'react-router'
import { getApiErrorMessage, queryApi, selectAvailability, selectStationDetail } from '@/api'
import { BackLink } from '@/components/layout'
import { ConfirmReservation, ReservationChargerInfo, ReservationDatePicker, StartTimePicker } from '@/components/reservation'
import { useReservationSelection } from '@/hooks'

function getPageError(error: unknown, fallback: string) {
  if (isAxiosError(error)) return getApiErrorMessage(error, fallback)
  return error instanceof Error ? error.message : fallback
}

export function ReservationPage() {
  const { stationId: stationIdParam, chargerId: chargerIdParam } = useParams()
  const stationId = Number(stationIdParam)
  const chargerId = Number(chargerIdParam)
  const validStationId = !!stationIdParam && /^[1-9]\d*$/.test(stationIdParam) && Number.isSafeInteger(stationId)
  const validChargerId = !!chargerIdParam && /^[1-9]\d*$/.test(chargerIdParam) && Number.isSafeInteger(chargerId)
  const { dateOptions, selectedDate, selectDate, selectedStartAt, setSelectedStartAt } = useReservationSelection()
  const stationQuery = queryApi.useGetStation(stationId, {
    query: { enabled: validStationId, select: selectStationDetail, retry: false },
  })
  const availabilityQuery = queryApi.useGetAvailability(stationId, { date: selectedDate }, {
    query: { enabled: validStationId && validChargerId, select: selectAvailability, retry: false },
  })
  const station = stationQuery.data
  const charger = station?.chargers.find(({ id }) => id === chargerId)
  const slots = availabilityQuery.data?.filter((slot) => slot.chargerId === chargerId)
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt)) ?? []
  const selectedSlot = slots.find((slot) => slot.startAt === selectedStartAt && slot.status === 'ENABLE')

  return (
    <div className="mx-auto w-full max-w-[620px] px-6 py-10">
      <BackLink to={validStationId ? `/stations/${stationId}` : '/'} label={validStationId ? '충전소 상세' : '충전소 목록'} />
      <p className="mt-10 text-label-12 tracking-[0.2em] text-brand">03 RESERVATION</p>
      <h1 className="mt-3 text-display-36 tracking-[-2.52px] text-fg-primary">충전 시간을 선택하세요</h1>

      {!validStationId || !validChargerId ? (
        <p className="mt-6 text-body-14 text-fg-secondary">충전기 정보를 찾을 수 없어요.</p>
      ) : stationQuery.isPending ? (
        <p className="mt-6 text-body-14 text-fg-secondary" role="status">충전소 정보를 불러오는 중…</p>
      ) : stationQuery.isError ? (
        <div className="mt-6" role="alert">
          <p className="text-body-14 text-destructive">{getPageError(stationQuery.error, '충전소 정보를 불러오지 못했어요.')}</p>
          <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void stationQuery.refetch()}>다시 시도</button>
        </div>
      ) : station && charger && charger.status !== 'OUT_OF_SERVICE' ? (
        <article className="mt-4 grid gap-7 rounded-26 border border-line bg-surface p-7 shadow-card">
          <ReservationChargerInfo stationName={station.name} charger={charger} />
          <ReservationDatePicker dateOptions={dateOptions} selectedDate={selectedDate} onSelectDate={selectDate} />
          {availabilityQuery.isPending ? (
            <p className="text-body-14 text-fg-secondary" role="status">예약 가능 시간을 불러오는 중…</p>
          ) : availabilityQuery.isError ? (
            <div role="alert">
              <p className="text-body-14 text-destructive">{getPageError(availabilityQuery.error, '예약 가능 시간을 불러오지 못했어요.')}</p>
              <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void availabilityQuery.refetch()}>다시 시도</button>
            </div>
          ) : slots.length > 0 ? (
            <StartTimePicker slots={slots} selectedStartAt={selectedSlot?.startAt} onSelectStartAt={setSelectedStartAt} />
          ) : (
            <p className="text-body-14 text-fg-secondary">이 날짜에 예약 가능한 시간이 없어요.</p>
          )}
          <ConfirmReservation stationId={station.id} chargerId={charger.id} date={selectedDate} slot={selectedSlot} />
        </article>
      ) : (
        <p className="mt-6 text-body-14 text-fg-secondary">
          {charger ? '지금은 예약할 수 없는 충전기예요.' : '충전기 정보를 찾을 수 없어요.'}
        </p>
      )}
    </div>
  )
}
