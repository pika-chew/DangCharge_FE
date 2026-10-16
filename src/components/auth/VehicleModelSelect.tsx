import { CarFront, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { VehicleModelOption } from '@/types'

type VehicleModelSelectProps = {
  id: string
  label: string
  vehicleModels: VehicleModelOption[]
  value: string
  onChange: (vehicleModel: string) => void
  onBlur?: () => void
  error?: string
  disabled?: boolean
  placeholder?: string
}

export function VehicleModelSelect({
  id, label, vehicleModels, value, onChange, onBlur, error, disabled = false,
  placeholder = '차종을 선택하세요',
}: VehicleModelSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedModel = vehicleModels.find((model) => model.value === value)
  const errorId = `${id}-error`

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) onBlur?.()
  }

  const handleSelect = (vehicleModel: string) => {
    onChange(vehicleModel)
    handleOpenChange(false)
  }

  return (
    <Collapsible open={open && !disabled} onOpenChange={handleOpenChange} disabled={disabled}>
      <label className="text-body-14-strong text-fg-primary" htmlFor={id}>{label}</label>
      <CollapsibleTrigger
        id={id}
        className={cn(
          'mt-3 flex h-12 w-full cursor-pointer items-center gap-3 rounded-14 border bg-surface px-4 text-left outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-destructive' : open ? 'border-brand' : 'border-line',
        )}
        type="button"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        <CarFront className="size-4 shrink-0 text-fg-secondary" aria-hidden />
        <span className={cn('min-w-0 flex-1 truncate text-body-14', selectedModel ? 'font-bold text-fg-primary' : 'text-fg-tertiary')}>
          {selectedModel?.label ?? placeholder}
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-fg-secondary transition-transform', open && 'rotate-180')} aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 grid gap-1 rounded-14 border border-line bg-surface p-2">
          {vehicleModels.map((model) => {
            const selected = model.value === value

            return (
              <li key={model.value}>
                <button
                  className={cn(
                    'flex h-11 w-full cursor-pointer items-center justify-between rounded-14 px-3 text-left text-body-14',
                    selected ? 'bg-brand-subtle font-bold text-brand' : 'text-fg-primary hover:bg-canvas',
                  )}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => handleSelect(model.value)}
                >
                  {model.label}
                  {selected && <Check className="size-4" aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
      {error && <p className="mt-2 text-caption-12 text-destructive" id={errorId}>{error}</p>}
    </Collapsible>
  )
}
