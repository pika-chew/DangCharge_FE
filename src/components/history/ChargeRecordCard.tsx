import { CalendarClock, CarFront, Check, ClockCheck, MapPin, Zap } from 'lucide-react'
import { StatGroup, StatItem } from '@/components/common'
import { formatReservationDateTime } from '@/lib/date'
import type { ChargingHistoryRecord } from '@/types'

type ChargeRecordCardProps = {
  record: ChargingHistoryRecord
}

function formatDateTime(value?: string) {
  return value ? formatReservationDateTime(value) ?? '시간 정보 없음' : '시간 정보 없음'
}

function formatVehicleModel(value?: string) {
  return value?.replaceAll('_', ' ') ?? '차종 정보 없음'
}

export function ChargeRecordCard({ record }: ChargeRecordCardProps) {
  const completedAt = formatDateTime(record.completedAt)

  return (
    <article className="rounded-26 border border-line bg-surface p-7 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-14 bg-success-subtle text-success">
          <Check className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-body-14-strong text-fg-primary">{record.stationName ?? '충전소 정보 없음'}</h2>
          <p className="mt-1 text-caption-12 text-fg-secondary">{completedAt}</p>
        </div>
        <span className="shrink-0 rounded-full bg-success-subtle px-3 py-1 text-label-12 text-success">충전 완료</span>
      </div>

      <div className="mt-5 grid gap-2 text-caption-12 text-fg-secondary">
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
          {record.stationAddress ?? '주소 정보 없음'}
        </p>
        <p className="flex items-center gap-2">
          <CarFront className="size-4 shrink-0 text-brand" aria-hidden />
          {formatVehicleModel(record.vehicleModel)}
        </p>
      </div>

      <StatGroup className="mt-6">
        <StatItem icon={CalendarClock} value={formatDateTime(record.reservedStartAt)} label="예약 시각" />
        <StatItem icon={Zap} value={formatDateTime(record.chargingStartedAt)} label="충전 시작" />
        <StatItem icon={ClockCheck} value={completedAt} label="충전 완료" />
      </StatGroup>
    </article>
  )
}
