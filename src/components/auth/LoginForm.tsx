import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'
import { AuthSwitchLink } from '@/components/auth/AuthSwitchLink'
import { FormField } from '@/components/auth/FormField'
import { useLoginForm } from '@/hooks'

export function LoginForm() {
  const { form, onSubmit } = useLoginForm()
  const { register, formState: { errors, isSubmitting } } = form

  return (
    <form className="mt-9" noValidate onSubmit={onSubmit} aria-busy={isSubmitting}>
      <div className="grid gap-5">
        <FormField
          id="login-id"
          label="아이디"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          disabled={isSubmitting}
          error={errors.id?.message}
          {...register('id')}
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {errors.root && <p className="mt-5 text-caption-12 text-destructive" role="alert">{errors.root.message}</p>}

      <AuthSubmitButton label={isSubmitting ? '로그인 중…' : '로그인'} disabled={isSubmitting} />

      <AuthSwitchLink question="아직 계정이 없나요?" linkLabel="회원가입" to="/signup" />
    </form>
  )
}
