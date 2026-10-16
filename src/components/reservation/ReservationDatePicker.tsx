import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReservationDateOption } from '@/types'

type ReservationDatePickerProps = {
  dateOptions: ReservationDateOption[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function ReservationDatePicker({ dateOptions, selectedDate, onSelectDate }: ReservationDatePickerProps) {
  const selectedOption = dateOptions.find(({ value }) => value === selectedDate)

  return (
    <section className="rounded-18 bg-canvas p-4" aria-labelledby="reservation-date-title">
      <div className="flex items-center gap-3">
        <CalendarDays className="size-5 shrink-0 text-brand" aria-hidden />
        <div>
          <h2 className="text-caption-12 text-fg-secondary" id="reservation-date-title">충전 날짜</h2>
          <p className="mt-0.5 text-body-14-strong text-fg-primary">{selectedOption?.fullLabel}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {dateOptions.map((option) => {
          const selected = option.value === selectedDate

          return (
            <button
              key={option.value}
              className={cn(
                'grid h-14 cursor-pointer place-content-center gap-0.5 rounded-14 border',
                selected ? 'border-brand bg-brand text-fg-on-brand' : 'border-line bg-surface text-fg-primary hover:border-brand',
              )}
              type="button"
              aria-pressed={selected}
              aria-label={option.fullLabel}
              onClick={() => onSelectDate(option.value)}
            >
              <span className={cn('text-caption-12', selected ? 'text-fg-on-brand/80' : 'text-fg-secondary')}>{option.dayLabel}</span>
              <span className="text-body-14-strong">{option.dayOfMonth}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
