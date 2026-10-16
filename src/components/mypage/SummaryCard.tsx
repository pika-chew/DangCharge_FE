import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type SummaryCardProps = {
  label: string
  icon: LucideIcon
  title: string
  description: string
  actionLabel: string
  actionIcon: LucideIcon
  actionTo?: string
  tone?: 'brand' | 'default'
}

export function SummaryCard({
  label,
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  actionTo,
  tone = 'default',
}: SummaryCardProps) {
  const isBrand = tone === 'brand'
  const actionClassName = cn(
    'mt-8 inline-flex w-fit items-center gap-2 text-label-12 no-underline',
    isBrand ? 'text-fg-on-brand' : 'text-brand',
  )
  const actionContent = (
    <>
      {actionLabel}
      <ActionIcon className="size-4" aria-hidden />
    </>
  )

  return (
    <section
      className={cn(
        'flex flex-col rounded-26 px-6 pt-6 pb-7',
        isBrand ? 'bg-brand text-fg-on-brand shadow-card' : 'border border-line bg-surface text-fg-primary',
      )}
    >
      <div className="flex h-6 items-center justify-between gap-2">
        <h2 className={cn('text-label-12', isBrand ? 'text-fg-on-brand/70' : 'text-fg-secondary')}>{label}</h2>
        <Icon className={cn('size-5', isBrand ? 'text-fg-on-brand/80' : 'text-brand')} aria-hidden />
      </div>
      <strong className="mt-6 text-heading-24 tracking-[-1.2px]">{title}</strong>
      <p className={cn('mt-3 text-caption-12', isBrand ? 'text-fg-on-brand/75' : 'text-fg-secondary')}>{description}</p>
      {actionTo ? (
        <Link className={actionClassName} to={actionTo}>{actionContent}</Link>
      ) : (
        <span className={actionClassName}>{actionContent}</span>
      )}
    </section>
  )
}
