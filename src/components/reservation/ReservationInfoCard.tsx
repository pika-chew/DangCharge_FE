import { ArrowRight, Clock, MapPin, Zap, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatReservationDateTime } from '@/lib/date'
import type { ReservationDetail } from '@/types'

type ReservationInfoCardProps = {
  reservation: ReservationDetail
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

const statusLabels: Record<NonNullable<ReservationDetail['status']>, string> = {
  CONFIRMED: '예약 확정',
  CHARGING: '충전 중',
  CANCELLED: '예약 취소',
  COMPLETED: '충전 완료',
  NO_SHOW: '예약 종료',
}

export function ReservationInfoCard({ reservation }: ReservationInfoCardProps) {
  const startTimeLabel = reservation.startAt ? formatReservationDateTime(reservation.startAt) : null
  const active = reservation.status === 'CONFIRMED' || reservation.status === 'CHARGING'

  return (
    <article className="rounded-26 bg-surface p-8 shadow-card" aria-labelledby="reservation-info-title">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-body-14-strong text-fg-primary" id="reservation-info-title">예약 정보</h2>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-label-12',
            active ? 'bg-brand-subtle text-brand' : reservation.status === 'COMPLETED'
              ? 'bg-success-subtle text-success' : 'bg-canvas text-fg-secondary',
          )}
        >
          {reservation.status ? statusLabels[reservation.status] : '예약 정보'}
        </span>
      </div>

      <h3 className="mt-8 text-heading-20 text-fg-primary">{reservation.stationName ?? '충전소 정보 없음'}</h3>
      {reservation.stationAddress && (
        <p className="mt-2 flex items-center gap-1 text-body-14 text-fg-secondary">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {reservation.stationAddress}
        </p>
      )}

      <div className="mt-7 grid grid-cols-2 gap-3">
        <InfoTile icon={Clock} value={startTimeLabel ?? '시간 정보 없음'} label="이용 시작" />
        <InfoTile
          icon={Zap}
          value={reservation.number ? `예약 번호 ${reservation.number}` : reservation.chargerId ? `충전기 ${reservation.chargerId}` : '예약 정보 없음'}
          label={reservation.number ? '예약 번호' : '충전기'}
        />
      </div>

      <div className="mt-7 grid gap-2">
        <Button asChild className="h-14 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover">
          <Link to="/mypage">
            마이페이지로
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  )
}
