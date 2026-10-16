import { useState } from 'react'
import { addDays, toDateValue } from '@/lib/date'
import type { ReservationDateOption } from '@/types'

const selectableDayCount = 7
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

function createDateOptions(today: Date): ReservationDateOption[] {
  return Array.from({ length: selectableDayCount }, (_, offset) => {
    const date = addDays(today, offset)
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
