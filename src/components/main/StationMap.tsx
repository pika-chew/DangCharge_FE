import type { StationCoordinates, StationListItem } from '@/types'

type StationMapProps = {
  query: string
  radius: number
  userLocation: StationCoordinates | null
  selectedStation?: StationListItem
  stationCount: number
  isLoading: boolean
  loadingMessage: string
  error?: string
  onRetry: () => void
  isRetrying: boolean
  canRetry: boolean
}

export function StationMap({
  query, radius, userLocation, selectedStation, stationCount,
  isLoading, loadingMessage, error, onRetry, isRetrying, canRetry,
}: StationMapProps) {
  return (
    <section
      className="relative h-[430px] overflow-hidden rounded-26 border border-line bg-[#efedf2] min-[761px]:h-[512px]"
      aria-label="충전소 지도 준비 중"
    >
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-[6px] bg-[#e2dfe7]" />
      <div className="pointer-events-none absolute top-[50%] left-[-28%] h-[3px] w-[165%] rotate-[27deg] bg-[#d8d3df] blur-[1px]" />
      <div className="pointer-events-none absolute top-[50%] left-[-28%] h-[3px] w-[165%] -rotate-[64deg] bg-[#d8d3df] blur-[1px]" />
      <span className="absolute top-6 left-6 z-10 rounded-14 bg-surface px-3 py-2 text-xs font-semibold leading-4 shadow-[0_1px_3px_rgb(0_0_0/10%),0_1px_2px_-1px_rgb(0_0_0/10%)]">
        {query ? `검색: ${query}` : `주변 반경 ${(radius / 1000).toLocaleString('ko-KR')} km`}
      </span>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <strong className="text-heading-20 text-fg-primary">지도 준비 중</strong>
        <p className="text-body-14 text-fg-secondary" role={error ? 'alert' : 'status'}>
          {isLoading ? loadingMessage : error ?? `${query ? '검색 결과' : '주변 충전소'} ${stationCount}곳`}
        </p>
        {query && selectedStation && !isLoading && !error && (
          <p className="text-body-14-strong text-fg-primary">{selectedStation.name}</p>
        )}
        {error && canRetry && (
          <button
            type="button"
            className="text-body-14 text-brand underline disabled:opacity-50"
            disabled={isRetrying}
            onClick={onRetry}
          >
            {isRetrying ? '확인 중…' : '다시 시도'}
          </button>
        )}
      </div>
      {userLocation && <span className="absolute bottom-6 left-6 text-caption-12 text-fg-secondary">현재 위치 확인됨</span>}
    </section>
  )
}
