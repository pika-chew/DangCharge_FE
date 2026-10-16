import { Button } from '@/components/ui'

export function ReserveAction() {
  return (
    <div>
      <p className="text-caption-12 text-fg-secondary">
        예약 가능 시간 조회가 연결되면 충전기를 예약할 수 있어요.
      </p>
      <Button
        className="mt-8 h-[52px] w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
        type="button"
        disabled
      >
        예약 기능 준비 중
      </Button>
    </div>
  )
}
