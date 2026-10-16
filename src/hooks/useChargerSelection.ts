import { useState } from 'react'
import type { SampleCharger } from '@/types'

export function useChargerSelection(chargers: SampleCharger[]) {
  const [selectedChargerId, setSelectedChargerId] = useState(
    () => chargers.find((charger) => charger.status === 'available')?.id,
  )
  const selectedCharger = chargers.find((charger) => charger.id === selectedChargerId)

  return { selectedCharger, setSelectedChargerId }
}
