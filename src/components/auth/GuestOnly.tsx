import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks'

export function GuestOnly() {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) return <Navigate to="/" replace />

  return <Outlet />
}
