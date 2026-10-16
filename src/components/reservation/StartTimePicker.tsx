import { cn } from '@/lib/utils'

type StartTimePickerProps = {
  startTimes: string[]
  selectedStartTime?: string
  onSelectStartTime: (startTime: string) => void
}

export function StartTimePicker({ startTimes, selectedStartTime, onSelectStartTime }: StartTimePickerProps) {
  return (
    <section aria-labelledby="start-time-title">
      <h2 className="text-body-14-strong text-fg-primary" id="start-time-title">예약 시작 시간</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {startTimes.map((startTime) => {
          const selected = startTime === selectedStartTime

          return (
            <button
              key={startTime}
              className={cn(
                'h-[46px] cursor-pointer rounded-14 border text-body-14-strong',
                selected ? 'border-brand bg-brand text-fg-on-brand' : 'border-line bg-surface text-fg-secondary hover:border-brand',
              )}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectStartTime(startTime)}
            >
              {startTime}
            </button>
          )
        })}
      </div>
    </section>
  )
}
