import { Outlet, Route, Routes, useLocation } from 'react-router'
import { Header } from '@/components/layout'
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

function PageLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <Header mainPage={isHome} showNavigation={pathname !== '/mypage'} />
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
      </Route>
      <Route element={<PageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route element={<PlaceholderLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="stations/:stationId" element={<StationDetailPage />} />
          <Route path="reservation/complete" element={<ReservationCompletePage />} />
          <Route path="reservation/:chargerId" element={<ReservationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
