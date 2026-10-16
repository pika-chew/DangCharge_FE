import { ConfirmDialog } from '@/components/common'

type StopChargingDialogProps = {
  onConfirm: () => void
}

export function StopChargingDialog({ onConfirm }: StopChargingDialogProps) {
  return (
    <ConfirmDialog
      triggerLabel="충전 완료"
      title="지금 충전을 완료할까요?"
      description="예약한 1시간이 남아 있어도 바로 충전이 종료되고 충전 완료로 처리돼요."
      confirmLabel="충전 완료"
      onConfirm={onConfirm}
    />
  )
}
