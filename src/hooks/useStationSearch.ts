import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { getApiErrorMessage, queryApi, selectStationMarkers, selectStationSearchResults } from '@/api'
import { defaultStationSearchRadius } from '@/constants'
import { useDeviceLocation } from '@/hooks/useDeviceLocation'
import { geocodeAddress, getStationAddress } from '@/lib/naverGeocoding'
import type { StationListItem, StationMarker, StationSearchArea } from '@/types'

const minimumKeywordMessage = '검색어는 공백을 제외하고 2글자 이상 입력해주세요.'

function getKeywordError(value: string) {
  if (/[^\p{Script=Hangul}\s]/u.test(value)) return '검색어는 한글과 공백만 입력해주세요.'
  if (Array.from(value.replace(/\s/g, '')).length < 2) return minimumKeywordMessage
  return undefined
}

function readRadius(value: string | null) {
  if (value === null || value.trim() === '') return defaultStationSearchRadius
  const radius = Number(value)
  return Number.isFinite(radius) && radius >= 1 && radius <= 20_000
    ? radius : defaultStationSearchRadius
}

export function useStationSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('keyword')?.trim() ?? ''
  const [draft, setDraft] = useState<{ query: string; value: string; error?: string } | null>(null)
  const [selection, setSelection] = useState<{ query: string; id: number } | null>(null)
  const searchText = draft?.query === query ? draft.value : query
  const isSearch = query.length > 0
  const keywordError = isSearch ? getKeywordError(query) : undefined
  const validQuery = isSearch && !keywordError
  const inputError = draft?.query === query ? draft.error
    : keywordError
  const location = useDeviceLocation()
  const radius = readRadius(searchParams.get('radius'))
  const searchArea: StationSearchArea | null = location.coordinates
    ? { ...location.coordinates, radius } : null

  // GPS가 없을 때는 비활성화하며 임시 좌표로 요청하지 않습니다.
  const nearbyQuery = queryApi.useGetStationsInRadius(searchArea ?? { lat: 0, lng: 0, radius }, {
    query: { enabled: searchArea !== null && !isSearch, select: selectStationMarkers, retry: false },
  })
  const searchQuery = queryApi.useSearchStations({ keyword: query }, {
    query: { enabled: isSearch && validQuery, select: selectStationSearchResults, retry: false },
  })
  const activeQuery = isSearch ? searchQuery : nearbyQuery
  const stations = useMemo<StationListItem[]>(() => {
    if (isSearch) return validQuery ? searchQuery.data ?? [] : []
    return location.coordinates ? nearbyQuery.data ?? [] : []
  }, [isSearch, validQuery, searchQuery.data, nearbyQuery.data, location.coordinates])
  const selectedStation = stations.find((station) => selection?.query === query && station.id === selection.id)
    ?? stations[0]
  const stationLocationQueries = useQueries({
    queries: stations.map((station) => {
      const address = getStationAddress(station)
      return {
        queryKey: ['station-location', address, station.latitude, station.longitude],
        queryFn: () => station.latitude !== undefined && station.longitude !== undefined
          ? Promise.resolve({ lat: station.latitude, lng: station.longitude })
          : geocodeAddress(address),
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }),
    combine: (results) => ({
      coordinates: results.map((result) => result.data),
      errors: results.map((result) => result.isError ? result.error : null),
      isPending: results.some((result) => result.isPending),
      isFetching: results.some((result) => result.isFetching),
      refetch: () => { results.forEach((result) => { void result.refetch() }) },
    }),
  })
  const mapStations: StationMarker[] = useMemo(() => stations.flatMap((station, index) => {
    const coordinates = stationLocationQueries.coordinates[index]
    return coordinates ? [{ ...station, latitude: coordinates.lat, longitude: coordinates.lng }] : []
  }), [stations, stationLocationQueries.coordinates])
  const locationsPending = stationLocationQueries.isPending
  const locationsFetching = stationLocationQueries.isFetching
  const focusedStationId = selection?.query === query ? selection.id : undefined
  const focusedStationIndex = stations.findIndex((station) => station.id === focusedStationId)
  const focusedLocationError = stationLocationQueries.errors[focusedStationIndex]
  const failedLocationError = stationLocationQueries.errors.find((locationError) => locationError !== null)
  const failedLocationCount = stationLocationQueries.errors.filter(Boolean).length
  const isLoading = isSearch
    ? validQuery && searchQuery.isPending
    : location.isLocating || (searchArea !== null && nearbyQuery.isPending)
  const error = keywordError
    ? keywordError
    : !isSearch && location.error ? location.error
      : activeQuery.isError ? getApiErrorMessage(activeQuery.error, '충전소 목록을 불러오지 못했어요.')
        : undefined
  const mapError = error ?? (focusedLocationError
    ? focusedLocationError.message
    : !locationsPending && mapStations.length === 0 && failedLocationError
      ? failedLocationError.message
      : undefined)
  const mapWarning = !locationsPending && mapStations.length > 0 && failedLocationCount > 0
    ? `${failedLocationCount}곳의 주소를 변환하지 못해 지도에서 제외했어요.` : undefined

  function setSearchText(value: string) {
    setDraft({ query, value: value.replace(/[^\p{Script=Hangul}\s]/gu, '') })
  }

  function retry() {
    if (isSearch) {
      if (validQuery) void searchQuery.refetch()
    } else if (!searchArea) {
      location.requestLocation()
    } else {
      void nearbyQuery.refetch()
    }
  }

  function retryMap() {
    if (!error && stations.length > 0) stationLocationQueries.refetch()
    else retry()
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const keyword = searchText.trim()
    const validationError = keyword ? getKeywordError(keyword) : undefined
    if (validationError) {
      setDraft({ query, value: searchText, error: validationError })
      return
    }
    setDraft(null)
    setSelection(null)

    if (keyword === query) {
      retry()
      return
    }

    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.delete('lat')
      next.delete('lng')
      if (keyword) next.set('keyword', keyword)
      else next.delete('keyword')
      return next
    })
  }

  const selectStation = useCallback((id: number) => {
    setSelection({ query, id })
  }, [query, setSelection])

  return {
    searchText,
    setSearchText,
    inputError,
    query,
    stations,
    mapStations,
    selectedStation,
    focusedStationId,
    selectStation,
    userLocation: location.coordinates,
    searchArea,
    radius,
    isLoading,
    loadingMessage: !isSearch && location.isLocating
      ? '현재 위치를 확인하고 있어요.' : '충전소를 불러오고 있어요.',
    isSearching: isSearch && searchQuery.isFetching,
    error,
    retry,
    canRetry: !(isSearch && !validQuery),
    isRetrying: activeQuery.isFetching || (!isSearch && location.isLocating),
    mapIsLoading: isLoading || locationsPending,
    mapLoadingMessage: locationsPending
      ? '충전소 주소의 위치를 찾고 있어요.' : !isSearch && location.isLocating
        ? '현재 위치를 확인하고 있어요.' : '충전소를 불러오고 있어요.',
    mapError,
    mapWarning,
    retryMap,
    isMapRetrying: activeQuery.isFetching || locationsFetching
      || (!isSearch && location.isLocating),
    canRetryMap: !(isSearch && !validQuery),
    handleSearch,
  }
}
