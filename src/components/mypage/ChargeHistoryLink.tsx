import { ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router'

type ChargeHistoryLinkProps = {
  count: number
}

export function ChargeHistoryLink({ count }: ChargeHistoryLinkProps) {
  return (
    <Link
      className="flex min-h-[84px] items-center gap-3 rounded-18 border border-line bg-surface py-5 pr-6 pl-5 text-fg-primary no-underline hover:border-brand"
      to="/history"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-14 bg-brand-subtle text-brand">
        <FileText className="size-[18px]" aria-hidden />
      </span>
      <span className="grid min-w-0 flex-1 gap-1">
        <strong className="text-body-14-strong">충전 내역</strong>
        <span className="text-caption-12 text-fg-secondary">총 {count}회의 충전 기록</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-fg-tertiary" aria-hidden />
    </Link>
  )
}
