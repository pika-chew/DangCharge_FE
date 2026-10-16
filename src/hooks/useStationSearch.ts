import { useState, type FormEvent } from 'react'
import { sampleStations } from '@/constants'

export function useStationSearch() {
  const [searchText, setSearchText] = useState('')
  const [query, setQuery] = useState('')
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  const stations = sampleStations.filter((station) =>
    `${station.name} ${station.address} 서울 강남구 테헤란동`
      .toLocaleLowerCase('ko-KR')
      .includes(query.toLocaleLowerCase('ko-KR')),
  )

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuery(searchText.trim())
    setSelectedStationId(null)
  }

  return {
    searchText,
    setSearchText,
    query,
    stations,
    selectedStationId,
    setSelectedStationId,
    handleSearch,
  }
}
