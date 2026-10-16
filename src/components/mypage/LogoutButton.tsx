import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { commandApi, getApiErrorMessage, getServerErrorMessage } from '@/api'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger, Button,
} from '@/components/ui'
import { useAuth } from '@/hooks'
import { getAuthTokens } from '@/lib/auth'

export function LogoutButton() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { mutateAsync, isPending } = commandApi.useLogout({ mutation: { retry: false } })
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const submissionInFlight = useRef(false)

  const handleLogout = async () => {
    if (submissionInFlight.current) return
    submissionInFlight.current = true
    setErrorMessage(null)

    try {
      const tokens = getAuthTokens()
      if (tokens) {
        const response = await mutateAsync({ data: { refreshToken: tokens.refreshToken } })
        if (response.success !== true) {
          setErrorMessage(getServerErrorMessage(response) ?? '로그아웃하지 못했어요. 다시 시도해주세요.')
          return
        }
      }

      logout()
      setOpen(false)
      navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '로그아웃하지 못했어요. 다시 시도해주세요.'))
    } finally {
      submissionInFlight.current = false
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => {
      if (isPending) return
      if (nextOpen) setErrorMessage(null)
      setOpen(nextOpen)
    }}>
      <AlertDialogTrigger asChild>
        <Button className="h-14 w-full rounded-14 border-line bg-surface text-body-14-strong text-fg-secondary hover:bg-canvas" type="button" variant="outline">
          로그아웃
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃할까요?</AlertDialogTitle>
          <AlertDialogDescription>다시 이용하려면 로그인해야 해요.</AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage && <p className="text-caption-12 text-destructive" role="alert">{errorMessage}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-brand text-fg-on-brand hover:bg-brand-hover"
            disabled={isPending}
            onClick={(event) => { event.preventDefault(); void handleLogout() }}
          >
            {isPending ? '로그아웃 중…' : '로그아웃'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
