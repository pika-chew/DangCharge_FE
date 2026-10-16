import { CalendarClock, Check, ClockCheck, MapPin, Zap } from 'lucide-react'
import { StatGroup, StatItem, StopChargingDialog } from '@/components/common'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { SampleChargeRecord } from '@/types'

type ChargeRecordCardProps = {
  record: SampleChargeRecord
  onCompleteCharging: (recordId: string) => void
}

export function ChargeRecordCard({ record, onCompleteCharging }: ChargeRecordCardProps) {
  const charging = record.status === 'charging'
  const StatusIcon = charging ? Zap : Check

  return (
    <article className="rounded-26 border border-line bg-surface p-7 shadow-card">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-14',
            charging ? 'bg-brand-subtle text-brand' : 'bg-success-subtle text-success',
          )}
        >
          <StatusIcon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-body-14-strong text-fg-primary">{charging ? '충전 중' : '충전 완료'}</h2>
          <p className="mt-1 text-caption-12 text-fg-secondary">
            {record.date} · {charging ? `${record.reservedAt} 시작` : record.completedAt}
          </p>
        </div>
        <strong className="shrink-0 text-heading-20 text-fg-primary">{record.amount.toLocaleString('ko-KR')}원</strong>
      </div>

      <StatGroup className="mt-6">
        <StatItem icon={CalendarClock} value={record.reservedAt} label="예약 시각" />
        <StatItem icon={MapPin} value={record.stationName} label="충전소" />
        <StatItem icon={ClockCheck} value={record.completedAt} label={charging ? '완료 예정 시각' : '충전 완료 시각'} />
      </StatGroup>

      <div className="mt-6">
        {charging ? (
          <StopChargingDialog onConfirm={() => onCompleteCharging(record.id)} />
        ) : (
          <Button
            variant="outline"
            className="h-[46px] w-full rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas"
            type="button"
          >
            영수증 확인하기
          </Button>
        )}
      </div>
    </article>
  )
}
