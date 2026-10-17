import { isAxiosError } from 'axios'
import { UserRoundPen } from 'lucide-react'
import { getApiErrorMessage } from '@/api'
import { BackLink } from '@/components/layout'
import { EditProfileForm } from '@/components/mypage'
import { useMyPageData, useVehicleModels } from '@/hooks'

function getPageError(error: unknown, fallback: string) {
  if (isAxiosError(error)) return getApiErrorMessage(error, fallback)
  return error instanceof Error ? error.message : fallback
}

export function EditProfilePage() {
  const { userQuery, reservationQuery } = useMyPageData()
  const vehicleModelsQuery = useVehicleModels(userQuery.isSuccess)
  const vehicleModels = vehicleModelsQuery.data ?? []
  const vehicleModelsUnavailable = vehicleModelsQuery.isPending
    || vehicleModelsQuery.isError || vehicleModels.length === 0

  return (
    <div className="mx-auto w-full max-w-[620px] px-6 py-10">
      <BackLink to="/mypage" label="마이페이지" />
      <div className="mt-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">내 정보 수정</h1>
          <p className="mt-3 text-body-14 text-fg-secondary">유저명과 등록된 차종을 변경할 수 있어요.</p>
        </div>
        <UserRoundPen className="size-7 shrink-0 text-brand" aria-hidden />
      </div>

      {userQuery.isPending ? (
        <p className="mt-10 rounded-26 border border-line bg-surface p-8 text-body-14 text-fg-secondary" role="status">
          내 정보를 불러오는 중…
        </p>
      ) : userQuery.isError || !userQuery.data ? (
        <div className="mt-10 rounded-26 border border-line bg-surface p-8" role="alert">
          <p className="text-body-14 text-destructive">
            {getPageError(userQuery.error, '내 정보를 불러오지 못했어요.')}
          </p>
          <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void userQuery.refetch()}>
            다시 시도
          </button>
        </div>
      ) : (
        <EditProfileForm
          user={userQuery.data}
          reservation={reservationQuery.data}
          reservationUnavailable={reservationQuery.isPending || reservationQuery.isError || !reservationQuery.data}
          vehicleModels={vehicleModels}
          vehicleModelsUnavailable={vehicleModelsUnavailable}
          vehicleModelsLoading={vehicleModelsQuery.isPending}
          onRetryVehicleModels={() => { void vehicleModelsQuery.refetch() }}
        />
      )}
    </div>
  )
}
