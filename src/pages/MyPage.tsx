import { ArrowRight, CarFront, ChevronRight, Clock } from 'lucide-react'
import { ChargeHistoryLink, LogoutButton, SummaryCard } from '@/components/mypage'
import { sampleMyPage } from '@/constants'

export function MyPage() {
  const { userName, reservation, vehicle, chargeHistoryCount } = sampleMyPage

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 py-16">
      <h1 className="text-display-36 tracking-[-2.52px] text-fg-primary">안녕하세요, {userName}님</h1>
      <p className="mt-3 text-body-14 text-fg-secondary">당충전 이용 정보를 한 곳에서 확인하세요.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 min-[761px]:grid-cols-2">
        <SummaryCard
          tone="brand"
          label="예약 현황"
          icon={Clock}
          title="예약이 있어요"
          description={`${reservation.time} · ${reservation.stationName}`}
          actionLabel="예약 확인하기"
          actionIcon={ArrowRight}
        />
        <SummaryCard
          label="내 차종"
          icon={CarFront}
          title={vehicle.model}
          description={`${vehicle.trim} · ${vehicle.year}`}
          actionLabel="차량 정보 수정"
          actionIcon={ChevronRight}
        />
      </div>

      <div className="mt-10">
        <ChargeHistoryLink count={chargeHistoryCount} />
      </div>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  )
}
