import { Link, NavLink } from 'react-router'
import userIcon from '@/assets/home/user.svg'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui'

export type HeaderNavigation = 'mypage' | 'routes' | 'none'

type HeaderProps = {
  navigation?: HeaderNavigation
}

const routeLinks = [
  { label: '충전 내역', to: '/history' },
  { label: '마이페이지', to: '/mypage' },
  { label: '로그인', to: '/login' },
  { label: '회원가입', to: '/signup' },
]

export function Header({ navigation = 'routes' }: HeaderProps) {
  return (
    <header className="h-[75px] border-b border-[#ece8f1] bg-surface">
      <div className="mx-auto flex h-[74px] w-full max-w-[1180px] items-center justify-between px-6">
        <Logo />

        {navigation !== 'none' && (
          <nav aria-label="주요 메뉴">
            {navigation === 'mypage' ? (
              <Button asChild variant="outline" className="h-[42px] gap-2 rounded-full border-line bg-surface px-4 text-[13px] font-bold text-[#5f596b] hover:bg-[#f7f5fb]">
                <Link to="/mypage"><img src={userIcon} alt="" />마이페이지</Link>
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {routeLinks.map(({ label, to }) => (
                  <NavLink key={to} className="text-[#5f596b] no-underline aria-[current=page]:font-bold" to={to}>{label}</NavLink>
                ))}
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
