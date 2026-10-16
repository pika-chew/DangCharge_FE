import { isAxiosError } from 'axios'
import { Link, useLocation, useParams } from 'react-router'
import { getApiErrorMessage, queryApi, selectReservationDetail } from '@/api'
import { BackLink } from '@/components/layout'
import { CompletionHero, ReservationInfoCard } from '@/components/reservation'
import type { ReservationDetail } from '@/types'

export function ReservationCompletePage() {
  const location = useLocation()
  const { reservationId: reservationIdParam } = useParams()
  const reservationId = Number(reservationIdParam)
  const validReservationId = !!reservationIdParam && /^[1-9]\d*$/.test(reservationIdParam) && Number.isSafeInteger(reservationId)
  let postedReservation: ReservationDetail | undefined
  if (validReservationId && location.state && typeof location.state === 'object' && 'reservation' in location.state) {
    try {
      const candidate = selectReservationDetail({ success: true, data: location.state.reservation })
      if (candidate.id === reservationId) postedReservation = candidate
    } catch {
      // 새로고침이나 잘못된 화면 상태에서는 서버에서 다시 조회합니다.
    }
  }
  const reservationQuery = queryApi.useGetReservation(reservationId, {
    query: { enabled: validReservationId && !postedReservation, select: selectReservationDetail, retry: false },
  })
  const reservation = postedReservation ?? reservationQuery.data

  if (!validReservationId) {
    return (
      <div className="mx-auto w-full max-w-[620px] px-6 py-10">
        <BackLink to="/mypage" label="마이페이지" />
        <p className="mt-10 text-body-14 text-fg-secondary">예약 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  if (!reservation && reservationQuery.isPending) {
    return <p className="mx-auto w-full max-w-[620px] px-6 py-16 text-body-14 text-fg-secondary" role="status">예약 정보를 불러오는 중…</p>
  }

  if (!reservation) {
    const error = reservationQuery.error
    const message = isAxiosError(error)
      ? getApiErrorMessage(error, '예약 정보를 불러오지 못했어요.')
      : error instanceof Error ? error.message : '예약 정보를 불러오지 못했어요.'

    return (
      <div className="mx-auto w-full max-w-[620px] px-6 py-10" role="alert">
        <BackLink to="/mypage" label="마이페이지" />
        <p className="mt-10 text-body-14 text-destructive">{message}</p>
        <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void reservationQuery.refetch()}>다시 시도</button>
        <Link className="mt-4 block text-body-14 text-brand underline" to="/mypage">마이페이지에서 예약 확인하기</Link>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-brand-subtle/60">
      <div className="mx-auto w-full max-w-[620px] px-6 py-16">
        <CompletionHero status={reservation.status} />
        <div className="mt-10">
          <ReservationInfoCard reservation={reservation} />
        </div>
      </div>
    </div>
  )
}
