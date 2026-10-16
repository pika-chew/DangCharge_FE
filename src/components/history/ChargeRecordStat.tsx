import type { LucideIcon } from 'lucide-react'

type ChargeRecordStatProps = {
  icon: LucideIcon
  value: string
  label: string
}

export function ChargeRecordStat({ icon: Icon, value, label }: ChargeRecordStatProps) {
  return (
    <div className="flex min-w-0 flex-col items-center px-2 text-center">
      <Icon className="size-4 text-brand" aria-hidden />
      <dt className="order-last mt-1 text-caption-12 text-fg-tertiary">{label}</dt>
      <dd className="mt-2 max-w-full truncate text-body-14-strong text-fg-primary">{value}</dd>
    </div>
  )
}
