import type { SampleStation } from '@/types'

type StationMapProps = {
  stations: SampleStation[]
  selectedStationId: string | null
  onSelectStation: (stationId: string) => void
}

export function StationMap({ stations, selectedStationId, onSelectStation }: StationMapProps) {
  return (
    <section
      className="relative h-[430px] overflow-hidden rounded-26 border border-line bg-[#efedf2] min-[761px]:h-[512px]"
      aria-label="서울 강남구 충전소 위치 예시"
    >
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-[6px] bg-[#e2dfe7]" />
      <div className="pointer-events-none absolute top-[50%] left-[-28%] h-[3px] w-[165%] rotate-[27deg] bg-[#d8d3df] blur-[1px]" />
      <div className="pointer-events-none absolute top-[50%] left-[-28%] h-[3px] w-[165%] -rotate-[64deg] bg-[#d8d3df] blur-[1px]" />
      <span className="absolute top-6 left-6 z-10 rounded-14 bg-surface px-3 py-2 text-xs font-semibold leading-4 shadow-[0_1px_3px_rgb(0_0_0/10%),0_1px_2px_-1px_rgb(0_0_0/10%)]">
        서울 · 강남구
      </span>
      {stations.map((station) => (
        <button
          key={station.id}
          className={`absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-4 border-white shadow-[0_10px_15px_-3px_rgb(0_0_0/10%),0_4px_6px_-4px_rgb(0_0_0/10%)] ${station.markerTone === 'muted' ? 'bg-[#aaa2b4]' : 'bg-brand'} ${selectedStationId === station.id ? 'outline-3 outline-offset-3 outline-brand/35' : ''}`}
          style={station.markerPosition}
          type="button"
          aria-label={`${station.name} 위치`}
          aria-pressed={selectedStationId === station.id}
          onClick={() => onSelectStation(station.id)}
        />
      ))}
    </section>
  )
}
