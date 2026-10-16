import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui'
import { useLoginForm } from '@/hooks'

export function LoginForm() {
  const { form, onSubmit } = useLoginForm()
  const { register, formState: { errors, isSubmitting } } = form

  return (
    <form className="mt-9" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5">
        <FormField
          id="login-id"
          label="아이디"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          error={errors.id?.message}
          {...register('id')}
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {errors.root && <p className="mt-5 text-caption-12 text-destructive" role="alert">{errors.root.message}</p>}

      <Button
        className="mt-7 h-12 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
        type="submit"
        disabled={isSubmitting}
      >
        로그인
        <ArrowRight className="size-4" aria-hidden />
      </Button>

      <p className="mt-7 text-center text-body-14 text-fg-secondary">
        아직 계정이 없나요?{' '}
        <Link className="font-bold text-brand no-underline" to="/signup">회원가입</Link>
      </p>
    </form>
  )
}
