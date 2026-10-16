import type { ReactNode } from 'react'
import { Logo } from '@/components/layout'

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <Logo />
      <section className="mt-12 w-full max-w-[428px] rounded-26 border border-line bg-surface p-10 shadow-card" aria-labelledby="auth-title">
        <h1 className="text-[32px] leading-10 font-bold tracking-[-1.6px] text-fg-primary" id="auth-title">{title}</h1>
        <p className="mt-4 text-body-14 text-fg-secondary">{description}</p>
        {children}
      </section>
    </div>
  )
}
