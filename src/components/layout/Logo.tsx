import { Link } from 'react-router'
import logoIcon from '@/assets/home/logo.svg'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      className={cn('inline-flex items-center gap-3 text-base leading-6 font-bold text-fg-primary no-underline', className)}
      to="/"
      aria-label="당충전 홈"
    >
      <span className="grid size-10 place-items-center rounded-14 bg-brand">
        <img src={logoIcon} alt="" />
      </span>
      <span>당충전</span>
    </Link>
  )
}
