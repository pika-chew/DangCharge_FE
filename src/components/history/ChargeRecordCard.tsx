import { CalendarClock, Check, ClockCheck, MapPin } from 'lucide-react'
import { ChargeRecordStat } from '@/components/history/ChargeRecordStat'
import { Button } from '@/components/ui'
import type { SampleChargeRecord } from '@/types'

type ChargeRecordCardProps = {
  record: SampleChargeRecord
}

export function ChargeRecordCard({ record }: ChargeRecordCardProps) {
  return (
    <article className="rounded-26 border border-line bg-surface p-7 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-14 bg-success-subtle text-success">
          <Check className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-body-14-strong text-fg-primary">충전 완료</h2>
          <p className="mt-1 text-caption-12 text-fg-secondary">{record.date} · {record.completedAt}</p>
        </div>
        <strong className="shrink-0 text-heading-20 text-fg-primary">{record.amount.toLocaleString('ko-KR')}원</strong>
      </div>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-18 bg-canvas py-5">
        <ChargeRecordStat icon={CalendarClock} value={record.reservedAt} label="예약 시각" />
        <ChargeRecordStat icon={MapPin} value={record.stationName} label="충전소" />
        <ChargeRecordStat icon={ClockCheck} value={record.completedAt} label="충전 완료 시각" />
      </dl>

      <Button
        variant="outline"
        className="mt-6 h-[46px] w-full rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas"
        type="button"
      >
        영수증 확인하기
      </Button>
    </article>
  )
}
