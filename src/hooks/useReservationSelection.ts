import { useState } from 'react'
import type { ReservationDateOption } from '@/types'

const selectableDayCount = 7
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

function toDateValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

function createDateOptions(today: Date): ReservationDateOption[] {
  return Array.from({ length: selectableDayCount }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
    const weekday = weekdays[date.getDay()]
    const dayLabel = offset === 0 ? '오늘' : offset === 1 ? '내일' : weekday
    const relativeLabel = offset < 2 ? dayLabel : `${weekday}요일`

    return {
      value: toDateValue(date),
      dayLabel,
      dayOfMonth: date.getDate(),
      fullLabel: `${relativeLabel}, ${date.getMonth() + 1}월 ${date.getDate()}일`,
    }
  })
}

export function useReservationSelection(startTimes: string[]) {
  const [dateOptions] = useState(() => createDateOptions(new Date()))
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].value)
  const [selectedStartTime, setSelectedStartTime] = useState(() => startTimes[0])

  return {
    dateOptions,
    selectedDate,
    setSelectedDate,
    selectedStartTime,
    setSelectedStartTime,
  }
}
