import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks'

export function RequireAuth() {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />

  return <Outlet />
}
