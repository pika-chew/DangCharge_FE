import { ArrowRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ConfirmDialog } from '@/components/common'
import { Button } from '@/components/ui'
import { formatRelativeDate } from '@/lib/date'

type ConfirmReservationProps = {
  chargerId: string
  date: string
  startTime?: string
}

export function ConfirmReservation({ chargerId, date, startTime }: ConfirmReservationProps) {
  const navigate = useNavigate()

  // API 연결 전 데모용 이동입니다. 예약 요청 후 백엔드 응답이 성공일 때만 완료 화면으로 이동하도록 바꿔야 합니다.
  const handleConfirm = (time: string) => {
    navigate(`/reservation/complete?${new URLSearchParams({ chargerId, date, time })}`)
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-caption-12 text-fg-secondary">
        <Clock className="size-4 shrink-0 text-brand" aria-hidden />
        예약 시간부터 1시간 동안 이용할 수 있어요.
      </p>
      <div className="mt-7">
        {startTime ? (
          <ConfirmDialog
            triggerTone="brand"
            triggerLabel={(
              <>
                {startTime} 예약 확정
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
            title={`${formatRelativeDate(date)} ${startTime}에 예약할까요?`}
            description={`${chargerId} 충전기를 ${startTime}부터 1시간 동안 이용할 수 있어요.`}
            confirmLabel="예약 확정"
            onConfirm={() => handleConfirm(startTime)}
          />
        ) : (
          <Button className="h-14 w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand" type="button" disabled>
            예약 가능한 시간이 없어요
          </Button>
        )}
      </div>
    </div>
  )
}
