import { Link } from 'react-router'
import userIcon from '@/assets/home/user.svg'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui'

type HeaderProps = {
  showMyPageLink?: boolean
}

export function Header({ showMyPageLink = true }: HeaderProps) {
  return (
    <header className="h-[75px] border-b border-[#ece8f1] bg-surface">
      <div className="mx-auto flex h-[74px] w-full max-w-[1180px] items-center justify-between px-6">
        <Logo />

        {showMyPageLink && (
          <nav aria-label="주요 메뉴">
            <Button asChild variant="outline" className="h-[42px] gap-2 rounded-full border-line bg-surface px-4 text-[13px] font-bold text-[#5f596b] hover:bg-[#f7f5fb]">
              <Link to="/mypage"><img src={userIcon} alt="" />마이페이지</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
