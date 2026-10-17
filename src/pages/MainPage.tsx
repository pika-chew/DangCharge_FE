import { useCallback, useState } from 'react'
import { StationList } from '@/components/main/StationList'
import { StationMap } from '@/components/main/StationMap'
import { StationSearch } from '@/components/main/StationSearch'
import { useStationSearch } from '@/hooks'

export function MainPage() {
  const {
    searchText,
    setSearchText,
    inputError,
    query,
    stations,
    mapStations,
    selectedStation,
    focusedStationId,
    selectStation,
    userLocation,
    radius,
    isLoading,
    loadingMessage,
    isSearching,
    error,
    retry,
    isRetrying,
    canRetry,
    mapIsLoading,
    mapLoadingMessage,
    mapError,
    mapWarning,
    retryMap,
    isMapRetrying,
    canRetryMap,
    handleSearch,
  } = useStationSearch()
  const [listFocusRequest, setListFocusRequest] = useState<{ query: string; stationId: number }>()
  const handleMarkerSelect = useCallback((stationId: number) => {
    selectStation(stationId)
    setListFocusRequest({ query, stationId })
  }, [query, selectStation])

  return (
    <div className="min-h-[calc(100vh-75px)] bg-canvas">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-16">
        <h1 className="mb-8 text-display-36 tracking-[-2.52px] text-fg-primary">어디에서 충전할까요?</h1>
        <StationSearch
          value={searchText}
          onValueChange={setSearchText}
          onSearch={handleSearch}
          isSearching={isSearching}
          error={inputError}
        />
        <div className="mt-12 grid grid-cols-1 gap-5 min-[761px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <StationMap
            query={query}
            radius={radius}
            userLocation={userLocation}
            stations={mapStations}
            selectedStation={selectedStation}
            focusedStationId={focusedStationId}
            isLoading={mapIsLoading}
            loadingMessage={mapLoadingMessage}
            error={mapError}
            warning={mapWarning}
            onRetry={retryMap}
            isRetrying={isMapRetrying}
            canRetry={canRetryMap}
            onSelectStation={handleMarkerSelect}
          />
          <StationList
            stations={stations}
            query={query}
            radius={radius}
            hasLocation={userLocation !== null}
            selectedStation={selectedStation}
            focusRequest={listFocusRequest?.query === query ? listFocusRequest : undefined}
            onSelectStation={selectStation}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            onRetry={retry}
            isRetrying={isRetrying}
            canRetry={canRetry}
          />
        </div>
      </div>
    </div>
  )
}
