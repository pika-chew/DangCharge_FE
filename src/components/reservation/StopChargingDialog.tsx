import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components/ui'

type StopChargingDialogProps = {
  onConfirm: () => void
}

export function StopChargingDialog({ onConfirm }: StopChargingDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-14 w-full rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas"
          type="button"
        >
          충전 완료
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>지금 충전을 완료할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            예약한 1시간이 남아 있어도 바로 충전이 종료되고 충전 완료로 처리돼요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-brand text-fg-on-brand hover:bg-brand-hover" onClick={onConfirm}>
            충전 완료
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
