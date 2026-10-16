import { StationList } from '@/components/main/StationList'
import { StationMap } from '@/components/main/StationMap'
import { StationSearch } from '@/components/main/StationSearch'
import { useStationSearch } from '@/hooks'

export function MainPage() {
  const {
    searchText,
    setSearchText,
    query,
    stations,
    selectedStationId,
    setSelectedStationId,
    handleSearch,
  } = useStationSearch()

  return (
    <div className="min-h-[calc(100vh-75px)] bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-16">
        <h1 className="mb-8 text-[36px] leading-10 font-bold tracking-[-2.52px] text-ink">어디에서 충전할까요?</h1>
        <StationSearch value={searchText} onValueChange={setSearchText} onSearch={handleSearch} />
        <div className="mt-12 grid grid-cols-1 gap-5 min-[761px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <StationMap stations={stations} selectedStationId={selectedStationId} onSelectStation={setSelectedStationId} />
          <StationList stations={stations} selectedStationId={selectedStationId} showLocationSummary={!query} />
        </div>
      </div>
    </div>
  )
}
