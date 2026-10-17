type LocationSummaryProps = {
  query: string
  radius: number
  hasLocation: boolean
}

export function LocationSummary({ query, radius, hasLocation }: LocationSummaryProps) {
  return (
    <div className="grid min-h-16 gap-1 rounded-18 bg-brand-subtle px-4 py-3" aria-live="polite">
      <span className="text-label-12 text-brand">{query ? `검색어: ${query}` : '주변 충전소'}</span>
      {!query && (
        <strong className="text-body-14-strong text-fg-primary">
          {hasLocation ? `현재 위치 기준 · 반경 ${(radius / 1000).toLocaleString('ko-KR')} km` : '현재 위치 확인 필요'}
        </strong>
      )}
    </div>
  )
}
