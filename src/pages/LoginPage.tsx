import { AuthCard, LoginForm } from '@/components/auth'

export function LoginPage() {
  return (
    <AuthCard title="반갑습니다" description="당충전으로 빠르게 충전소를 찾아보세요.">
      <LoginForm />
    </AuthCard>
  )
}
