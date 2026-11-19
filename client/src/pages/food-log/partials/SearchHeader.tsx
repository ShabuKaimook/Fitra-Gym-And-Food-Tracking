import { TopBarTitle } from '@/components/TopBarTitle'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AddFoodLink } from './AddFoodLink'

type Props = { title: string; newFoodUrl: string }

// Back (mobile only), "Add to Lunch" and Add food. Desktop also gets a breadcrumb in the top bar.
export const SearchHeader = ({ title, newFoodUrl }: Props) => (
  <header className="flex items-center gap-1">
    <TopBarTitle>
      <span className="text-sm text-ink-2">Food / Food search</span>
    </TopBarTitle>
    <Link
      to={ROUTE_PATHS.HOME}
      aria-label="Back"
      className="-ml-2.5 grid size-11 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 lg:hidden"
    >
      <ChevronLeft size={22} aria-hidden />
    </Link>
    <h1 className="m-0 mr-auto text-[21px] leading-tight font-extrabold tracking-[-0.6px] lg:text-[25px]">{title}</h1>
    <AddFoodLink to={newFoodUrl} />
  </header>
)
