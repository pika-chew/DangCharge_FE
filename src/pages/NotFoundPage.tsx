import { BackLink } from '@/components/layout'

export function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-16">
      <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 mb-10 text-body-14 text-fg-secondary">주소가 바뀌었거나 없는 페이지예요.</p>
      <BackLink to="/" label="메인으로 돌아가기" />
    </div>
  )
}
