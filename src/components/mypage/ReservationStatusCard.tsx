import { ArrowRight, BatteryCharging, CalendarX2, Clock3 } from 'lucide-react'
import { Link } from 'react-router'
import type { MyReservation } from '@/hooks'
import { cn } from '@/lib/utils'

type ReservationStatusCardProps = {
  reservation: MyReservation
}

function formatStartAt(value?: string) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
}

export function ReservationStatusCard({ reservation }: ReservationStatusCardProps) {
  const { state, message, reservation: detail } = reservation
  const isReserved = state === 'RESERVED'
  const isCharging = state === 'CHARGING'
  const Icon = isReserved ? Clock3 : isCharging ? BatteryCharging : CalendarX2
  const startAt = formatStartAt(detail?.startAt)
  const details = [detail?.stationName, startAt].filter(Boolean).join(' · ')
  const title = isReserved ? '예약 중이에요' : isCharging ? '충전 중이에요' : '예약이 없어요'

  return (
    <section className={cn(
      'flex min-h-[204px] flex-col rounded-26 px-6 pt-6 pb-7',
      isReserved && 'bg-brand text-fg-on-brand shadow-card',
      isCharging && 'border border-line bg-success-subtle text-fg-primary',
      state === 'NONE' && 'border border-line bg-surface text-fg-primary',
      state !== 'NONE' && detail?.reservationId && 'relative',
    )}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={cn('text-label-12', isReserved ? 'text-fg-on-brand/80' : 'text-fg-secondary')}>
          예약 현황
        </h2>
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-12',
          isReserved ? 'bg-white/20 text-fg-on-brand' : isCharging
            ? 'bg-surface text-success' : 'bg-canvas text-fg-secondary',
        )}>
          <Icon className="size-4" aria-hidden />
          {isReserved ? '예약 중' : isCharging ? '충전 중' : '예약 없음'}
        </span>
      </div>

      <strong className="mt-6 text-heading-24 tracking-[-1.2px]">{title}</strong>
      {details && state !== 'NONE' && (
        <p className={cn('mt-3 text-caption-12', isReserved ? 'text-fg-on-brand/90' : 'text-fg-secondary')}>
          {details}
        </p>
      )}
      {message && (
        <p className={cn('mt-3 text-caption-12', isReserved ? 'text-fg-on-brand/75' : 'text-fg-secondary')}>
          {message}
        </p>
      )}
      {state === 'NONE' && (
        <Link className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-label-12 text-brand no-underline" to="/">
          충전소 찾기 <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
      {state !== 'NONE' && detail?.reservationId && (
        <Link
          className="absolute inset-0 rounded-26 focus-visible:outline-3 focus-visible:outline-brand"
          to={`/reservation/complete/${detail.reservationId}`}
          aria-label="예약 상세 확인하기"
        />
      )}
    </section>
  )
}
