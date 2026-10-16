import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatGroupProps = {
  children: ReactNode
  className?: string
}

export function StatGroup({ children, className }: StatGroupProps) {
  return (
    <dl className={cn('grid grid-cols-3 divide-x divide-line rounded-18 bg-canvas py-5', className)}>
      {children}
    </dl>
  )
}
