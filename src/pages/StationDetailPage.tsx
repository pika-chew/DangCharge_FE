import { useParams } from 'react-router'

export function StationDetailPage() {
  const { stationId } = useParams()

  return <h1>충전소 상세: {stationId}</h1>
}
