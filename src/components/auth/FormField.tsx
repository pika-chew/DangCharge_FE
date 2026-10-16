import type { ComponentProps } from 'react'
import { Input } from '@/components/ui'

type FormFieldProps = ComponentProps<'input'> & {
  id: string
  label: string
  error?: string
}

export function FormField({ id, label, error, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label className="text-body-14-strong text-fg-primary" htmlFor={id}>{label}</label>
      <Input
        id={id}
        className="mt-3 h-12 rounded-14 border-line bg-surface px-4 text-body-14 text-fg-primary placeholder:text-fg-tertiary focus-visible:border-brand focus-visible:ring-brand/10"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && <p className="mt-2 text-caption-12 text-destructive" id={errorId}>{error}</p>}
    </div>
  )
}
