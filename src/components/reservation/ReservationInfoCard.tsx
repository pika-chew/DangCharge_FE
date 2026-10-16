import { ArrowRight, Clock, MapPin, Zap, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { StopChargingDialog } from '@/components/common'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

type ReservationInfoCardProps = {
  stationName: string
  address: string
  startTimeLabel: string
  reservationNumber: string
  chargingCompleted: boolean
  onCompleteCharging: () => void
}

function InfoTile({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-18 bg-canvas p-4">
      <Icon className="size-5 text-brand" aria-hidden />
      <p className="mt-3 text-body-14-strong text-fg-primary">{value}</p>
      <p className="text-caption-12 text-fg-tertiary">{label}</p>
    </div>
  )
}

export function ReservationInfoCard({
  stationName,
  address,
  startTimeLabel,
  reservationNumber,
  chargingCompleted,
  onCompleteCharging,
}: ReservationInfoCardProps) {
  return (
    <article className="rounded-26 bg-surface p-8 shadow-card" aria-labelledby="reservation-info-title">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-body-14-strong text-fg-primary" id="reservation-info-title">예약 정보</h2>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-label-12',
            chargingCompleted ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-brand',
          )}
        >
          {chargingCompleted ? '충전 완료' : '예약 확정'}
        </span>
      </div>

      <h3 className="mt-8 text-heading-20 text-fg-primary">{stationName}</h3>
      <p className="mt-2 flex items-center gap-1 text-body-14 text-fg-secondary">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {address}
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <InfoTile icon={Clock} value={startTimeLabel} label="이용 시작" />
        <InfoTile icon={Zap} value={`예약 번호 ${reservationNumber}`} label="차량 인증용" />
      </div>

      <div className="mt-7 grid gap-2">
        {!chargingCompleted && <StopChargingDialog onConfirm={onCompleteCharging} />}
        <Button asChild className="h-14 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover">
          <Link to="/history">
            충전 내역
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  )
}
