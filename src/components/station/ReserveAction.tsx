import { Link } from 'react-router'
import { Button } from '@/components/ui'

type ReserveActionProps = {
  stationId: number
  chargerId?: number
}

export function ReserveAction({ stationId, chargerId }: ReserveActionProps) {
  return (
    <div>
      <p className="text-caption-12 text-fg-secondary">
        시간대별 예약 가능 여부를 확인한 뒤 확정할 수 있어요.
      </p>
      {chargerId ? (
        <Button asChild className="mt-8 h-[52px] w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover">
          <Link to={`/stations/${stationId}/reservation/${chargerId}`}>예약 시간 확인하기</Link>
        </Button>
      ) : (
        <Button className="mt-8 h-[52px] w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand" type="button" disabled>
          예약 시간을 조회할 충전기가 없어요
        </Button>
      )}
    </div>
  )
}
