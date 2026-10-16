import { FileCheckCorner } from 'lucide-react'
import { ChargeRecordCard } from '@/components/history'
import { BackLink } from '@/components/layout'
import { sampleChargeRecords } from '@/constants'

export function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-10">
      <BackLink to="/mypage" label="마이페이지" />
      <div className="mt-10 flex items-center justify-between gap-4">
        <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">충전 내역</h1>
        <FileCheckCorner className="size-7 shrink-0 text-brand" aria-hidden />
      </div>

      <div className="mt-10 grid gap-4">
        {sampleChargeRecords.map((record) => (
          <ChargeRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}
