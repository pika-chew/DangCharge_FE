import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { commandApi, getApiErrorMessage, getServerErrorMessage, queryApi, selectReservationDetail } from '@/api'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, Button,
} from '@/components/ui'
import type { ReservationDetail } from '@/types'

type ReservationAction = 'checkIn' | 'cancel' | 'stop'

type ReservationActionsProps = {
  reservation: ReservationDetail
  onUpdated: (reservation: ReservationDetail) => void
}

const actionContent: Record<ReservationAction, {
  title: string
  description: string
  confirmLabel: string
  pendingLabel: string
  fallbackError: string
}> = {
  checkIn: {
    title: '충전을 시작할까요?',
    description: '충전 시작은 예약 시작 10분 전부터 15분 후까지 가능해요.',
    confirmLabel: '충전 시작',
    pendingLabel: '시작 중…',
    fallbackError: '충전을 시작하지 못했어요. 다시 시도해주세요.',
  },
  cancel: {
    title: '예약을 취소할까요?',
    description: '예약 취소는 시작 10분 전까지만 가능해요.',
    confirmLabel: '예약 취소',
    pendingLabel: '취소 중…',
    fallbackError: '예약을 취소하지 못했어요. 다시 시도해주세요.',
  },
  stop: {
    title: '충전을 종료할까요?',
    description: '종료하면 현재 충전이 완료 처리돼요.',
    confirmLabel: '충전 종료',
    pendingLabel: '종료 중…',
    fallbackError: '충전을 종료하지 못했어요. 다시 시도해주세요.',
  },
}

export function ReservationActions({ reservation, onUpdated }: ReservationActionsProps) {
  const queryClient = useQueryClient()
  const checkIn = commandApi.useCheckIn({ mutation: { retry: false } })
  const cancelReservation = commandApi.useCancelReservation({ mutation: { retry: false } })
  const stopCharging = commandApi.useStopCharging({ mutation: { retry: false } })
  const [action, setAction] = useState<ReservationAction | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const submissionInFlight = useRef(false)
  const isPending = checkIn.isPending || cancelReservation.isPending || stopCharging.isPending

  const invalidateReservationQueries = () => {
    void queryClient.invalidateQueries({ queryKey: queryApi.getGetReservationQueryKey(reservation.id) })
    void queryClient.invalidateQueries({ queryKey: queryApi.getGetMyReservationQueryKey() })

    if (reservation.stationId) {
      void queryClient.invalidateQueries({ queryKey: queryApi.getGetAvailabilityQueryKey(reservation.stationId) })
      void queryClient.invalidateQueries({ queryKey: queryApi.getGetStationQueryKey(reservation.stationId) })
    }
  }

  const handleAction = async () => {
    if (!action || submissionInFlight.current) return
    submissionInFlight.current = true
    setErrorMessage(null)
    const content = actionContent[action]

    try {
      let updatedReservation: ReservationDetail

      if (action === 'checkIn') {
        const response = await checkIn.mutateAsync({ reservationId: reservation.id })
        if (response.success !== true) {
          setErrorMessage(getServerErrorMessage(response) ?? content.fallbackError)
          return
        }

        const checkedInReservation = selectReservationDetail(response)
        if (checkedInReservation.id !== reservation.id) {
          setErrorMessage('충전 시작 응답을 확인할 수 없어요. 마이페이지에서 상태를 확인해주세요.')
          return
        }
        updatedReservation = { ...reservation, ...checkedInReservation, status: 'CHARGING' }
      } else if (action === 'cancel') {
        const response = await cancelReservation.mutateAsync({ reservationId: reservation.id })
        if (response.success !== true) {
          setErrorMessage(getServerErrorMessage(response) ?? content.fallbackError)
          return
        }
        updatedReservation = { ...reservation, status: 'CANCELLED' }
      } else {
        const response = await stopCharging.mutateAsync({ reservationId: reservation.id })
        if (response.success !== true) {
          setErrorMessage(getServerErrorMessage(response) ?? content.fallbackError)
          return
        }
        updatedReservation = { ...reservation, status: 'COMPLETED' }
      }

      invalidateReservationQueries()
      onUpdated(updatedReservation)
      setAction(null)
    } catch (error) {
      setErrorMessage(
        error instanceof Error && !('response' in error)
          ? error.message
          : getApiErrorMessage(error, content.fallbackError),
      )
    } finally {
      submissionInFlight.current = false
    }
  }

  const openAction = (nextAction: ReservationAction) => {
    setErrorMessage(null)
    setAction(nextAction)
  }

  const content = action ? actionContent[action] : null

  return (
    <>
      {reservation.status === 'CONFIRMED' && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="h-14 rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas"
            type="button"
            variant="outline"
            onClick={() => openAction('cancel')}
          >
            예약 취소
          </Button>
          <Button
            className="h-14 rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
            type="button"
            onClick={() => openAction('checkIn')}
          >
            충전 시작
          </Button>
        </div>
      )}

      {reservation.status === 'CHARGING' && (
        <Button
          className="h-14 w-full rounded-14 bg-brand text-body-14-strong text-fg-on-brand hover:bg-brand-hover"
          type="button"
          onClick={() => openAction('stop')}
        >
          충전 종료
        </Button>
      )}

      <AlertDialog open={action !== null} onOpenChange={(open) => {
        if (isPending) return
        if (!open) setAction(null)
      }}>
        {content && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{content.title}</AlertDialogTitle>
              <AlertDialogDescription>{content.description}</AlertDialogDescription>
            </AlertDialogHeader>
            {errorMessage && <p className="text-caption-12 text-destructive" role="alert">{errorMessage}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>닫기</AlertDialogCancel>
              <AlertDialogAction
                className={action === 'cancel'
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-brand text-fg-on-brand hover:bg-brand-hover'}
                disabled={isPending}
                onClick={(event) => { event.preventDefault(); void handleAction() }}
              >
                {isPending ? content.pendingLabel : content.confirmLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  )
}
