import type { ReactNode } from 'react'
import { Logo } from '@/components/layout'
import { cn } from '@/lib/utils'

type AuthCardProps = {
  eyebrow?: string
  title: string
  description: string
  wide?: boolean
  children: ReactNode
}

export function AuthCard({ eyebrow, title, description, wide = false, children }: AuthCardProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <Logo />
      <section
        className={cn(
          'mt-10 w-full rounded-26 border border-line bg-surface p-10 shadow-card',
          wide ? 'max-w-[558px]' : 'mt-12 max-w-[428px]',
        )}
        aria-labelledby="auth-title"
      >
        {eyebrow && <p className="mb-5 text-label-12 tracking-[0.2em] text-brand">{eyebrow}</p>}
        <h1 className="text-[32px] leading-10 font-bold tracking-[-1.6px] text-fg-primary" id="auth-title">{title}</h1>
        <p className="mt-4 text-body-14 text-fg-secondary">{description}</p>
        {children}
      </section>
    </div>
  )
}
