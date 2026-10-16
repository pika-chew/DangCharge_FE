import { useNavigate } from 'react-router'
import { ConfirmDialog } from '@/components/common'
import { useAuth } from '@/hooks'

export function LogoutButton() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <ConfirmDialog
      triggerLabel="로그아웃"
      title="로그아웃할까요?"
      description="다시 이용하려면 로그인해야 해요."
      confirmLabel="로그아웃"
      onConfirm={handleLogout}
    />
  )
}
