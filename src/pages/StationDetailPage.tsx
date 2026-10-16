import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router'
import { getApiErrorMessage, queryApi, selectStationDetail } from '@/api'
import { BackLink } from '@/components/layout'
import { ChargerList, ReserveAction, StationSummary } from '@/components/station'

export function StationDetailPage() {
  const { stationId: stationIdParam } = useParams()
  const stationId = Number(stationIdParam)
  const validStationId = !!stationIdParam && /^[1-9]\d*$/.test(stationIdParam) && Number.isSafeInteger(stationId)
  const stationQuery = queryApi.useGetStation(stationId, {
    query: { enabled: validStationId, select: selectStationDetail, retry: false },
  })
  const [selectedChargerId, setSelectedChargerId] = useState<number | null>(null)
  const reservableChargers = stationQuery.data?.chargers.filter(({ status }) => status !== 'OUT_OF_SERVICE') ?? []
  const selectedCharger = reservableChargers.find(({ id }) => id === selectedChargerId) ?? reservableChargers[0]

  let errorMessage = '충전소 정보를 찾을 수 없어요.'
  if (isAxiosError(stationQuery.error)) {
    errorMessage = stationQuery.error.response?.status === 404
      ? '충전소 정보를 찾을 수 없어요.'
      : getApiErrorMessage(stationQuery.error, '충전소 정보를 불러오지 못했어요.')
  } else if (stationQuery.error instanceof Error) {
    errorMessage = stationQuery.error.message
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-10">
      <BackLink to="/" label="충전소 목록" />
      {stationQuery.data ? (
        <article className="mt-8 grid gap-10 rounded-26 border border-line bg-surface p-8 shadow-card">
          <StationSummary station={stationQuery.data} />
          <ChargerList
            chargers={stationQuery.data.chargers}
            selectedChargerId={selectedCharger?.id}
            onSelectCharger={setSelectedChargerId}
          />
          <ReserveAction stationId={stationQuery.data.id} chargerId={selectedCharger?.id} />
        </article>
      ) : !validStationId ? (
        <p className="mt-8 text-body-14 text-fg-secondary">충전소 정보를 찾을 수 없어요.</p>
      ) : stationQuery.isPending ? (
        <p className="mt-8 text-body-14 text-fg-secondary" role="status">충전소 정보를 불러오는 중…</p>
      ) : (
        <div className="mt-8" role="alert">
          <p className="text-body-14 text-destructive">{errorMessage}</p>
          <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void stationQuery.refetch()}>
            다시 시도
          </button>
        </div>
      )}
    </div>
  )
}
