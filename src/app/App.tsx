import { Outlet, Route, Routes, useLocation } from 'react-router'
import { GuestOnly, RequireAuth } from '@/components/auth'
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

  return (
    <>
      <Header showMyPageLink={pathname !== '/mypage'} />
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

export default function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route element={<HeaderlessLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<HeaderlessLayout />}>
          <Route path="history" element={<HistoryPage />} />
          <Route path="stations/:stationId/reservation/:chargerId" element={<ReservationPage />} />
          <Route path="reservation/complete/:reservationId" element={<ReservationCompletePage />} />
        </Route>
        <Route element={<PageLayout />}>
          <Route index element={<MainPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="stations/:stationId" element={<StationDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
