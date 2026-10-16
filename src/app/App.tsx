import { Outlet, Route, Routes, useLocation } from 'react-router'
import { Header, type HeaderNavigation } from '@/components/layout'
import {
  HistoryPage,
  LoginPage,
  MainPage,
  MyPage,
  NotFoundPage,
  ReservationCompletePage,
  ReservationPage,
  SignupPage,
  StationDetailPage,
} from '@/pages'

function getHeaderNavigation(pathname: string): HeaderNavigation {
  if (pathname === '/' || pathname.startsWith('/stations/')) return 'mypage'
  if (pathname === '/mypage') return 'none'
  return 'routes'
}

function PageLayout() {
  const { pathname } = useLocation()

  return (
    <>
      <Header navigation={getHeaderNavigation(pathname)} />
      <main>
        <Outlet />
      </main>
    </>
  )
}

function HeaderlessLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}

function PlaceholderLayout() {
  return (
    <div className="mx-auto max-w-[960px] p-6">
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<HeaderlessLayout />}>
        <Route path="history" element={<HistoryPage />} />
        <Route path="reservation/:chargerId" element={<ReservationPage />} />
      </Route>
      <Route element={<PageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="stations/:stationId" element={<StationDetailPage />} />
        <Route element={<PlaceholderLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="reservation/complete" element={<ReservationCompletePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
