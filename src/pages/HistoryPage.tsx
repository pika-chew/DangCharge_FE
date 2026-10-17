import { isAxiosError } from 'axios'
import { ChevronLeft, ChevronRight, FileCheckCorner } from 'lucide-react'
import { useState } from 'react'
import { getApiErrorMessage, queryApi, selectChargingHistory } from '@/api'
import { ChargeRecordCard } from '@/components/history'
import { BackLink } from '@/components/layout'
import { Button } from '@/components/ui'

const historyPageSize = 20

function getHistoryError(error: unknown) {
  if (isAxiosError(error)) return getApiErrorMessage(error, '충전 내역을 불러오지 못했어요.')
  return error instanceof Error ? error.message : '충전 내역을 불러오지 못했어요.'
}

export function HistoryPage() {
  const [page, setPage] = useState(0)
  const historyQuery = queryApi.useGetHistory(
    { page, size: historyPageSize },
    { query: { select: selectChargingHistory, retry: false } },
  )
  const history = historyQuery.data
  const totalPages = history ? Math.max(1, Math.ceil(history.totalElements / history.size)) : 1

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-10">
      <BackLink to="/mypage" label="마이페이지" />
      <div className="mt-10 flex items-center justify-between gap-4">
        <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">충전 내역</h1>
        <FileCheckCorner className="size-7 shrink-0 text-brand" aria-hidden />
      </div>

      <div className="mt-10 grid gap-4">
        {historyQuery.isPending ? (
          <p className="rounded-26 border border-line bg-surface p-7 text-body-14 text-fg-secondary" role="status">
            충전 내역을 불러오는 중…
          </p>
        ) : historyQuery.isError ? (
          <div className="rounded-26 border border-line bg-surface p-7" role="alert">
            <p className="text-body-14 text-destructive">{getHistoryError(historyQuery.error)}</p>
            <button className="mt-3 text-body-14 text-brand underline" type="button" onClick={() => void historyQuery.refetch()}>
              다시 시도
            </button>
          </div>
        ) : history && history.records.length > 0 ? (
          history.records.map((record) => (
            <ChargeRecordCard key={record.reservationId} record={record} />
          ))
        ) : (
          <p className="rounded-26 border border-line bg-surface p-7 text-body-14 text-fg-secondary">
            아직 충전 내역이 없어요.
          </p>
        )}
      </div>

      {history && totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4" aria-label="충전 내역 페이지">
          <Button
            className="border-line bg-surface text-fg-secondary hover:bg-canvas"
            variant="outline"
            type="button"
            disabled={historyQuery.isFetching || page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            <ChevronLeft aria-hidden /> 이전
          </Button>
          <span className="text-caption-12 text-fg-secondary">{history.page + 1} / {totalPages}</span>
          <Button
            className="border-line bg-surface text-fg-secondary hover:bg-canvas"
            variant="outline"
            type="button"
            disabled={historyQuery.isFetching || page + 1 >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            다음 <ChevronRight aria-hidden />
          </Button>
        </nav>
      )}
    </div>
  )
}
