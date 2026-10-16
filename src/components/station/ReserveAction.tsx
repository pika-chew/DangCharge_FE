import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui'

type ReserveActionProps = {
  chargerId?: string
}

export function ReserveAction({ chargerId }: ReserveActionProps) {
  const buttonClassName = 'mt-8 h-[52px] w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover'

  return (
    <div>
      <p className="flex items-center gap-2 text-caption-12 text-fg-secondary">
        <ShieldCheck className="size-4 shrink-0 text-brand" aria-hidden />
        예약하면 충전기 자리를 10분간 확보해요.
      </p>
      {chargerId ? (
        <Button asChild className={buttonClassName}>
          <Link to={`/reservation/${encodeURIComponent(chargerId)}`}>{chargerId} 충전기 예약하기</Link>
        </Button>
      ) : (
        <Button className={buttonClassName} type="button" disabled>
          예약 가능한 충전기가 없어요
        </Button>
      )}
    </div>
  )
}
