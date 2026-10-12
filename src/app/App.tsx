import { NavLink, Outlet, Route, Routes } from 'react-router'
import { HistoryPage } from '../pages/HistoryPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { MyPage } from '../pages/MyPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ReservationCompletePage } from '../pages/ReservationCompletePage'
import { ReservationPage } from '../pages/ReservationPage'
import { SignupPage } from '../pages/SignupPage'
import { StationDetailPage } from '../pages/StationDetailPage'

function PageLayout() {
  return (
    <>
      <header className="site-header">
        <NavLink to="/" end>당충전</NavLink>
        <nav aria-label="주요 메뉴">
          <NavLink to="/history">충전 내역</NavLink>
          <NavLink to="/mypage">마이페이지</NavLink>
          <NavLink to="/login">로그인</NavLink>
          <NavLink to="/signup">회원가입</NavLink>
        </nav>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<HomePage />} />
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
