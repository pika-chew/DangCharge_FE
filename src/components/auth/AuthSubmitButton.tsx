import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

type AuthSubmitButtonProps = {
  label: string
  disabled?: boolean
}

export function AuthSubmitButton({ label, disabled }: AuthSubmitButtonProps) {
  return (
    <Button
      className="mt-7 h-12 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
      type="submit"
      disabled={disabled}
    >
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  )
}
