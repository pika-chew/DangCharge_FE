import { useEffect, useRef } from 'react'
import { LocationSummary } from '@/components/main/LocationSummary'
import { StationCard } from '@/components/main/StationCard'
import type { StationListItem } from '@/types'

type StationListProps = {
  stations: StationListItem[]
  query: string
  radius: number
  hasLocation: boolean
  selectedStation?: StationListItem
  focusRequest?: { stationId: number }
  onSelectStation: (id: number) => void
  isLoading: boolean
  loadingMessage: string
  error?: string
  onRetry: () => void
  isRetrying: boolean
  canRetry: boolean
}

export function StationList({
  stations, query, radius, hasLocation, selectedStation, focusRequest, onSelectStation,
  isLoading, loadingMessage, error, onRetry, isRetrying, canRetry,
}: StationListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const stationButtonsRef = useRef(new Map<number, HTMLButtonElement>())

  useEffect(() => {
    if (!focusRequest || isLoading || error) return
    const list = listRef.current
    const button = stationButtonsRef.current.get(focusRequest.stationId)
    if (!list || !button) return

    button.focus({ preventScroll: true })
    const cardBounds = (button.parentElement ?? button).getBoundingClientRect()
    const listBounds = list.getBoundingClientRect()
    const scrollOffset = cardBounds.top < listBounds.top
      ? cardBounds.top - listBounds.top
      : cardBounds.bottom > listBounds.bottom
        ? cardBounds.bottom - listBounds.bottom
        : 0

    // 지도와 페이지 위치는 유지하고 충전소 목록 안에서만 스크롤합니다.
    if (scrollOffset !== 0) {
      list.scrollTo({
        top: list.scrollTop + scrollOffset,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
    }
  }, [focusRequest, isLoading, error])

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
      <div ref={listRef} className="grid min-h-0 flex-1 auto-rows-max content-start gap-3 overflow-y-auto">
        <LocationSummary
          query={query}
          radius={radius}
          hasLocation={hasLocation}
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
            buttonRef={(button) => {
              if (button) stationButtonsRef.current.set(station.id, button)
              else stationButtonsRef.current.delete(station.id)
            }}
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
