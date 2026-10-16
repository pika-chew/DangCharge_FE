import { Controller } from 'react-hook-form'
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'
import { AuthSwitchLink } from '@/components/auth/AuthSwitchLink'
import { FormField } from '@/components/auth/FormField'
import { VehicleModelSelect } from '@/components/auth/VehicleModelSelect'
import { sampleVehicleModels } from '@/constants'
import { useSignupForm } from '@/hooks'

export function SignupForm() {
  const { form, onSubmit } = useSignupForm()
  const { register, control, formState: { errors, isSubmitting } } = form

  return (
    <form className="mt-9" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="signup-id"
          label="아이디"
          placeholder="사용할 아이디"
          autoComplete="username"
          error={errors.id?.message}
          {...register('id')}
        />
        <FormField
          id="signup-username"
          label="유저네임"
          placeholder="표시할 이름"
          autoComplete="nickname"
          error={errors.username?.message}
          {...register('username')}
        />
        <FormField
          id="signup-password"
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormField
          id="signup-password-confirm"
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더"
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="vehicleModelId"
            render={({ field, fieldState }) => (
              <VehicleModelSelect
                id="signup-vehicle-model"
                label="차종 선택"
                vehicleModels={sampleVehicleModels}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      <AuthSubmitButton label="가입하고 시작하기" disabled={isSubmitting} />

      <AuthSwitchLink question="이미 계정이 있나요?" linkLabel="로그인" to="/login" />
    </form>
  )
}
