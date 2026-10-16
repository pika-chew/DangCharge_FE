import { AuthCard, SignupForm } from '@/components/auth'

export function SignupPage() {
  return (
    <AuthCard
      eyebrow="GET STARTED"
      title="당충전을 시작해요"
      description="차량 정보를 등록하면 더 정확한 충전소를 추천해드려요."
      wide
    >
      <SignupForm />
    </AuthCard>
  )
}
