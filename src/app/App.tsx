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
  const isHome = useLocation().pathname === '/'

  return (
    <>
      <Header mainPage={isHome} />
      <main className={isHome ? '' : 'mx-auto max-w-[960px] p-6'}>
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="stations/:stationId" element={<StationDetailPage />} />
        <Route path="reservation/complete" element={<ReservationCompletePage />} />
        <Route path="reservation/:chargerId" element={<ReservationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
