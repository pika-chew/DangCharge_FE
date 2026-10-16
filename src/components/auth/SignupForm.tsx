import { Controller } from 'react-hook-form'
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'
import { AuthSwitchLink } from '@/components/auth/AuthSwitchLink'
import { FormField } from '@/components/auth/FormField'
import { VehicleModelSelect } from '@/components/auth/VehicleModelSelect'
import { useSignupForm } from '@/hooks'

export function SignupForm() {
  const { form, onSubmit, vehicleModels, vehicleModelsQuery, vehicleModelsUnavailable } = useSignupForm()
  const { register, control, formState: { errors, isSubmitting } } = form

  return (
    <form className="mt-9" noValidate onSubmit={onSubmit} aria-busy={isSubmitting}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="signup-id"
          label="아이디"
          placeholder="사용할 아이디"
          autoComplete="username"
          disabled={isSubmitting}
          error={errors.id?.message}
          {...register('id')}
        />
        <FormField
          id="signup-username"
          label="유저네임"
          placeholder="표시할 이름"
          autoComplete="nickname"
          disabled={isSubmitting}
          error={errors.username?.message}
          {...register('username')}
        />
        <FormField
          id="signup-password"
          label="비밀번호"
          type="password"
          placeholder="영문·숫자 포함 8~64자"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register('password')}
        />
        <FormField
          id="signup-password-confirm"
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="vehicleModel"
            render={({ field, fieldState }) => (
              <VehicleModelSelect
                id="signup-vehicle-model"
                label="차종 선택"
                vehicleModels={vehicleModels}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={isSubmitting || vehicleModelsUnavailable}
                placeholder={vehicleModelsQuery.isPending ? '차종 목록을 불러오는 중…' : '차종을 선택하세요'}
              />
            )}
          />
          {vehicleModelsQuery.isPending && (
            <p className="mt-2 text-caption-12 text-fg-secondary" role="status">차종 목록을 불러오고 있어요.</p>
          )}
          {!vehicleModelsQuery.isPending && vehicleModelsUnavailable && (
            <div className="mt-2 flex items-center gap-3" role="alert">
              <p className="text-caption-12 text-destructive">
                {vehicleModelsQuery.isError
                  ? '차종 목록을 불러오지 못했어요.'
                  : '선택할 수 있는 차종이 없어요.'}
              </p>
              <button
                type="button"
                className="shrink-0 text-caption-12 text-brand underline disabled:opacity-50"
                disabled={vehicleModelsQuery.isFetching}
                onClick={() => { void vehicleModelsQuery.refetch() }}
              >
                {vehicleModelsQuery.isFetching ? '불러오는 중…' : '다시 불러오기'}
              </button>
            </div>
          )}
        </div>
      </div>

      {errors.root && <p className="mt-5 text-caption-12 text-destructive" role="alert">{errors.root.message}</p>}

      <AuthSubmitButton
        label={isSubmitting ? '가입하는 중…' : '가입하고 시작하기'}
        disabled={isSubmitting || vehicleModelsUnavailable}
      />

      <AuthSwitchLink question="이미 계정이 있나요?" linkLabel="로그인" to="/login" />
    </form>
  )
}
