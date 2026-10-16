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
      <Route element={<HeaderlessLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="reservation/:chargerId" element={<ReservationPage />} />
        <Route path="reservation/complete" element={<ReservationCompletePage />} />
      </Route>
      <Route element={<PageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="stations/:stationId" element={<StationDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
