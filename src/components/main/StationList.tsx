import { LocationSummary } from '@/components/main/LocationSummary'
import { StationCard } from '@/components/main/StationCard'
import type { StationListItem } from '@/types'

type StationListProps = {
  stations: StationListItem[]
  query: string
  radius: number
  hasLocation: boolean
  selectedStation?: StationListItem
  onSelectStation: (id: number) => void
  isLoading: boolean
  loadingMessage: string
  error?: string
  onRetry: () => void
  isRetrying: boolean
  canRetry: boolean
}

export function StationList({
  stations, query, radius, hasLocation, selectedStation, onSelectStation,
  isLoading, loadingMessage, error, onRetry, isRetrying, canRetry,
}: StationListProps) {
  return (
    <section
      className="flex min-h-[512px] flex-col rounded-26 border border-line bg-surface p-6 min-[761px]:h-[512px]"
      aria-labelledby="station-list-title"
      aria-busy={isLoading || isRetrying}
    >
      <div className="mb-5 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-base leading-6 font-bold" id="station-list-title">충전소 목록</h2>
        {!isLoading && !error && <span className="text-caption-12 text-fg-tertiary">{stations.length}곳</span>}
      </div>
      <div className="grid min-h-0 content-start gap-3 overflow-y-auto">
        <LocationSummary
          query={query}
          radius={radius}
          hasLocation={hasLocation}
          selectedStation={!isLoading && !error ? selectedStation : undefined}
        />
        {isLoading ? (
          <p className="my-5 text-body-14 text-fg-secondary" role="status">{loadingMessage}</p>
        ) : error ? (
          <div className="my-5 grid justify-items-start gap-3" role="alert">
            <p className="text-body-14 text-destructive">{error}</p>
            {canRetry && (
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
        ) : stations.length > 0 ? stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            selected={selectedStation?.id === station.id}
            onSelect={onSelectStation}
          />
        )) : (
          <p className="my-5 text-body-14 text-fg-secondary" role="status">
            {query ? '검색 결과가 없습니다.' : '조회 반경 안에 충전소가 없습니다.'}
          </p>
        )}
      </div>
    </section>
  )
}
