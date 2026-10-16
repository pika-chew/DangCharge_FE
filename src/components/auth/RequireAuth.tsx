import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks'

export function RequireAuth() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
