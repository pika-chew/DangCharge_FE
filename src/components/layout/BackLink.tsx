import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

type BackLinkProps = {
  to: string
  label: string
}

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link className="inline-flex items-center gap-2 text-body-14 text-fg-secondary no-underline hover:text-fg-primary" to={to}>
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  )
}
