import { CarFront, ChevronRight } from 'lucide-react'
import { isAxiosError } from 'axios'
import { getApiErrorMessage } from '@/api'
import { ChargeHistoryLink, LogoutButton, ReservationStatusCard, SummaryCard } from '@/components/mypage'
import { useMyPageData, useVehicleModels } from '@/hooks'

function getPageError(error: unknown, fallback: string) {
  if (isAxiosError(error)) return getApiErrorMessage(error, fallback)
  return error instanceof Error ? error.message : fallback
}

export function MyPage() {
  const { userQuery, reservationQuery } = useMyPageData()
  const vehicleModelsQuery = useVehicleModels(userQuery.isSuccess)
  const vehicleModel = userQuery.data?.vehicleModel
  const vehicleLabel = vehicleModelsQuery.data?.find(({ value }) => value === vehicleModel)?.label

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 py-16">
      {userQuery.data ? (
        <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">
          안녕하세요, {userQuery.data.username}님
        </h1>
      ) : userQuery.isPending ? (
        <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">내 정보를 불러오는 중…</h1>
      ) : (
        <div role="alert">
          <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">내 정보를 불러오지 못했어요</h1>
          <p className="mt-3 text-body-14 text-destructive">
            {getPageError(userQuery.error, '잠시 후 다시 시도해주세요.')}
          </p>
          <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void userQuery.refetch()}>
            다시 시도
          </button>
        </div>
      )}
      <p className="mt-3 text-body-14 text-fg-secondary">당충전 이용 정보를 한 곳에서 확인하세요.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 min-[761px]:grid-cols-2">
        {reservationQuery.data ? (
          <ReservationStatusCard reservation={reservationQuery.data} />
        ) : (
          <section className="min-h-[204px] rounded-26 border border-line bg-surface p-6" aria-live="polite">
            <h2 className="text-label-12 text-fg-secondary">예약 현황</h2>
            {reservationQuery.isPending ? (
              <p className="mt-6 text-heading-20 text-fg-primary">예약 현황을 불러오는 중…</p>
            ) : (
              <div role="alert">
                <p className="mt-6 text-heading-20 text-fg-primary">예약 현황을 불러오지 못했어요</p>
                <p className="mt-3 text-caption-12 text-destructive">
                  {getPageError(reservationQuery.error, '잠시 후 다시 시도해주세요.')}
                </p>
                <button className="mt-4 text-label-12 text-brand underline" type="button" onClick={() => void reservationQuery.refetch()}>
                  다시 시도
                </button>
              </div>
            )}
          </section>
        )}
        {userQuery.data && (
          <SummaryCard
            label="내 차종"
            icon={CarFront}
            title={vehicleModelsQuery.isPending ? '차종 이름을 불러오는 중…' : vehicleLabel ?? vehicleModel ?? '차종 정보 없음'}
            description="등록한 차량"
            actionLabel="차량 정보 수정"
            actionIcon={ChevronRight}
          />
        )}
      </div>

      <div className="mt-10">
        <ChargeHistoryLink />
      </div>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  )
}
