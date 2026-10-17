import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { FormField, VehicleModelSelect } from '@/components/auth'
import { Button } from '@/components/ui'
import { useEditProfileForm } from '@/hooks'
import type { MyReservation, UserProfile } from '@/hooks'
import type { VehicleModelOption } from '@/types'

type EditProfileFormProps = {
  user: UserProfile
  reservation?: MyReservation
  reservationUnavailable: boolean
  vehicleModels: VehicleModelOption[]
  vehicleModelsUnavailable: boolean
  vehicleModelsLoading: boolean
  onRetryVehicleModels: () => void
}

export function EditProfileForm({
  user,
  reservation,
  reservationUnavailable,
  vehicleModels,
  vehicleModelsUnavailable,
  vehicleModelsLoading,
  onRetryVehicleModels,
}: EditProfileFormProps) {
  const hasActiveReservation = reservation?.state === 'RESERVED' || reservation?.state === 'CHARGING'
  const vehicleChangeBlocked = hasActiveReservation || reservationUnavailable
  const { form, onSubmit } = useEditProfileForm({ user, vehicleChangeBlocked })
  const { register, control, formState: { errors, isSubmitting } } = form
  const vehicleSelectDisabled = isSubmitting || vehicleChangeBlocked || vehicleModelsUnavailable
  const displayedVehicleModels = vehicleModels.some(({ value }) => value === user.vehicleModel)
    ? vehicleModels
    : [{ value: user.vehicleModel, label: user.vehicleModel.replaceAll('_', ' ') }, ...vehicleModels]

  const vehicleHelp = hasActiveReservation
    ? '진행 중인 예약이 있어 차종을 수정할 수 없어요.'
    : reservationUnavailable
      ? '예약 현황을 확인할 수 없어 차종 수정을 잠시 사용할 수 없어요.'
      : vehicleModelsUnavailable
        ? '차종 목록을 불러와야 차종을 수정할 수 있어요.'
        : '진행 중인 예약이 없을 때만 차종을 수정할 수 있어요.'

  return (
    <form
      className="mt-10 rounded-26 border border-line bg-surface p-8 shadow-card"
      noValidate
      aria-busy={isSubmitting}
      onSubmit={onSubmit}
    >
      <div className="grid gap-6">
        <FormField
          id="edit-profile-username"
          label="유저명"
          placeholder="표시할 이름"
          autoComplete="nickname"
          disabled={isSubmitting}
          error={errors.username?.message}
          {...register('username')}
        />

        <div>
          <Controller
            control={control}
            name="vehicleModel"
            render={({ field, fieldState }) => (
              <VehicleModelSelect
                id="edit-profile-vehicle-model"
                label="차종"
                vehicleModels={displayedVehicleModels}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={vehicleSelectDisabled}
                placeholder={vehicleModelsLoading ? '차종 목록을 불러오는 중…' : '차종을 선택하세요'}
              />
            )}
          />
          <p className="mt-2 text-caption-12 text-fg-secondary">{vehicleHelp}</p>
          {vehicleModelsUnavailable && !vehicleModelsLoading && !vehicleChangeBlocked && (
            <button
              className="mt-2 text-caption-12 text-brand underline"
              type="button"
              onClick={onRetryVehicleModels}
            >
              차종 목록 다시 불러오기
            </button>
          )}
        </div>
      </div>

      {errors.root && <p className="mt-5 text-caption-12 text-destructive" role="alert">{errors.root.message}</p>}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Button
          asChild
          className="h-12 rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas"
          variant="outline"
        >
          <Link to="/mypage">취소</Link>
        </Button>
        <Button
          className="h-12 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중…' : '변경사항 저장'}
        </Button>
      </div>
    </form>
  )
}
