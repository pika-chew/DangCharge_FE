export function toDateValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

// value는 YYYY-MM-DD 형식입니다.
export function formatRelativeDate(value: string, today = new Date()) {
  if (value === toDateValue(today)) return '오늘'
  if (value === toDateValue(addDays(today, 1))) return '내일'

  const [, month, day] = value.split('-').map(Number)
  return `${month}월 ${day}일`
}

export function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
