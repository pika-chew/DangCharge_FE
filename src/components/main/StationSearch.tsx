import type { FormEventHandler } from 'react'
import searchIcon from '@/assets/home/search.svg'
import { Button, Input } from '@/components/ui'

type StationSearchProps = {
  value: string
  onValueChange: (value: string) => void
  onSearch: FormEventHandler<HTMLFormElement>
}

export function StationSearch({ value, onValueChange, onSearch }: StationSearchProps) {
  return (
    <form
      className="flex h-[78px] w-full max-w-[600px] items-center gap-3 rounded-[18px] border border-[#e5e0ec] bg-white px-5 py-4 shadow-[0_1px_3px_rgb(0_0_0/10%),0_1px_2px_-1px_rgb(0_0_0/10%)] focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/10"
      role="search"
      onSubmit={onSearch}
    >
      <img src={searchIcon} alt="" />
      <Input
        className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-ink shadow-none outline-none placeholder:text-ink/50 focus-visible:border-0 focus-visible:ring-0"
        aria-label="충전소명 또는 지역 검색"
        placeholder="충전소명 또는 지역을 검색하세요"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <Button className="h-11 rounded-[14px] bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover" type="submit">
        검색
      </Button>
    </form>
  )
}
