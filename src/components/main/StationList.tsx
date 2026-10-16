import { LocationSummary } from '@/components/main/LocationSummary'
import { StationCard } from '@/components/main/StationCard'
import type { SampleStation } from '@/types'

type StationListProps = {
  stations: SampleStation[]
  selectedStationId: string | null
  showLocationSummary: boolean
}

export function StationList({ stations, selectedStationId, showLocationSummary }: StationListProps) {
  return (
    <section className="min-h-[512px] rounded-[26px] border border-border bg-white p-6 min-[761px]:h-[512px]" aria-labelledby="station-list-title">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="text-base leading-6 font-bold" id="station-list-title">충전소 목록</h2>
        <span className="text-xs leading-4 text-[#958da2]">강남구 {stations.length}곳</span>
      </div>
      <div className="grid gap-3">
        {showLocationSummary && <LocationSummary />}
        {stations.length > 0 ? stations.map((station) => (
          <StationCard key={station.id} station={station} selected={selectedStationId === station.id} />
        )) : (
          <p className="my-5 text-sm text-[#625b6e]">검색 결과가 없습니다.</p>
        )}
      </div>
    </section>
  )
}
