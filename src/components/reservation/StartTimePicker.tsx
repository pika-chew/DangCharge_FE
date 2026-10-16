import { cn } from '@/lib/utils'
import { formatReservationTime } from '@/lib/date'
import type { ReservationSlot } from '@/types'

type StartTimePickerProps = {
  slots: ReservationSlot[]
  selectedStartAt?: string
  onSelectStartAt: (startAt: string) => void
}

export function StartTimePicker({ slots, selectedStartAt, onSelectStartAt }: StartTimePickerProps) {
  return (
    <section aria-labelledby="start-time-title">
      <h2 className="text-body-14-strong text-fg-primary" id="start-time-title">예약 시작 시간</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const selected = slot.startAt === selectedStartAt
          const available = slot.status === 'ENABLE'
          const time = formatReservationTime(slot.startAt)

          return (
            <button
              key={slot.startAt}
              className={cn(
                'min-h-[46px] rounded-14 border px-2 py-1 text-body-14-strong',
                selected ? 'border-brand bg-brand text-fg-on-brand'
                  : available ? 'cursor-pointer border-line bg-surface text-fg-secondary hover:border-brand'
                    : 'cursor-not-allowed border-line bg-canvas text-fg-tertiary',
              )}
              type="button"
              disabled={!available}
              aria-pressed={selected}
              aria-label={`${time} ${available ? '예약 가능' : '이미 예약됨'}`}
              onClick={() => onSelectStartAt(slot.startAt)}
            >
              {time}
            </button>
          )
        })}
      </div>
      {slots.some((slot) => slot.status === 'DISABLE') && (
        <p className="mt-2 text-caption-12 text-fg-tertiary">회색 시간은 이미 예약됐어요.</p>
      )}
    </section>
  )
}
