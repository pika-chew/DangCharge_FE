import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui'

type ConfirmReservationProps = {
  chargerId: string
  date: string
  startTime?: string
}

export function ConfirmReservation({ chargerId, date, startTime }: ConfirmReservationProps) {
  const buttonClassName = 'mt-7 h-14 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover'

  return (
    <div>
      <p className="flex items-center gap-2 text-caption-12 text-fg-secondary">
        <Clock className="size-4 shrink-0 text-brand" aria-hidden />
        예약 시간부터 1시간 동안 이용할 수 있어요.
      </p>
      {/* API 연결 전 데모용 이동입니다. 예약 요청 후 백엔드 응답이 성공일 때만 완료 화면으로 이동하도록 바꿔야 합니다. */}
      {startTime ? (
        <Button asChild className={buttonClassName}>
          <Link to={`/reservation/complete?${new URLSearchParams({ chargerId, date, time: startTime })}`}>
            {startTime} 예약 확정
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      ) : (
        <Button className={buttonClassName} type="button" disabled>
          예약 가능한 시간이 없어요
        </Button>
      )}
    </div>
  )
}
