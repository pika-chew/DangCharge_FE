import { useParams } from 'react-router'

export function ReservationPage() {
  const { chargerId } = useParams()

  return <h1>충전기 예약: {chargerId}</h1>
}
