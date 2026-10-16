import { ArrowRight, Clock } from 'lucide-react'
import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { commandApi, getApiErrorMessage, getServerErrorMessage, queryApi } from '@/api'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger, Button,
} from '@/components/ui'
import { formatRelativeDate, formatReservationTime } from '@/lib/date'
import type { ReservationSlot } from '@/types'

type ConfirmReservationProps = {
  stationId: number
  chargerId: number
  date: string
  slot?: ReservationSlot
}

export function ConfirmReservation({ stationId, chargerId, date, slot }: ConfirmReservationProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = commandApi.useCreateReservation({ mutation: { retry: false } })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const submissionInFlight = useRef(false)
  const startTime = slot ? formatReservationTime(slot.startAt) : null

  const handleConfirm = async () => {
    if (submissionInFlight.current || !slot || slot.status !== 'ENABLE') return
    submissionInFlight.current = true
    setErrorMessage(null)

    try {
      const response = await mutateAsync({ data: { chargerId, startAt: slot.startAt } })
      if (response.success !== true) {
        setErrorMessage(getServerErrorMessage(response) ?? '예약하지 못했어요. 다시 시도해주세요.')
        return
      }

      const reservationId = response.data?.reservationId
      if (typeof reservationId !== 'number' || !Number.isSafeInteger(reservationId) || reservationId <= 0) {
        setErrorMessage('예약 응답을 확인할 수 없어요. 마이페이지에서 예약 상태를 확인해주세요.')
        return
      }

      void queryClient.invalidateQueries({ queryKey: queryApi.getGetMyReservationQueryKey() })
      void queryClient.invalidateQueries({ queryKey: queryApi.getGetAvailabilityQueryKey(stationId, { date }) })
      setOpen(false)
      navigate(`/reservation/complete/${reservationId}`, {
        replace: true,
        state: { reservation: response.data },
      })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '예약하지 못했어요. 잠시 후 다시 시도해주세요.'))
      void queryClient.invalidateQueries({ queryKey: queryApi.getGetAvailabilityQueryKey(stationId, { date }) })
    } finally {
      submissionInFlight.current = false
    }
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-caption-12 text-fg-secondary">
        <Clock className="size-4 shrink-0 text-brand" aria-hidden />
        예약 시간부터 1시간 동안 이용할 수 있어요.
      </p>
      <div className="mt-7">
        {startTime && slot ? (
          <AlertDialog open={open} onOpenChange={(nextOpen) => {
            if (isPending) return
            if (nextOpen) setErrorMessage(null)
            setOpen(nextOpen)
          }}>
            <AlertDialogTrigger asChild>
              <Button className="h-14 w-full gap-2 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover" type="button">
                {startTime} 예약 확정 <ArrowRight className="size-4" aria-hidden />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{formatRelativeDate(date)} {startTime}에 예약할까요?</AlertDialogTitle>
                <AlertDialogDescription>충전기 {chargerId}를 {startTime}부터 1시간 동안 이용할 수 있어요.</AlertDialogDescription>
              </AlertDialogHeader>
              {errorMessage && <p className="text-caption-12 text-destructive" role="alert">{errorMessage}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-brand text-fg-on-brand hover:bg-brand-hover"
                  disabled={isPending}
                  onClick={(event) => { event.preventDefault(); void handleConfirm() }}
                >
                  {isPending ? '예약 중…' : '예약 확정'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button className="h-14 w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand" type="button" disabled>
            예약 시간을 선택해주세요
          </Button>
        )}
      </div>
    </div>
  )
}
