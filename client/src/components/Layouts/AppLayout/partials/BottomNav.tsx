import { ROUTE_PATHS } from '@/constants/routePaths'
import { ChartNoAxesColumn, Dumbbell, House, Plus, Utensils } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { NavItem } from './shared'

const LEFT: NavItem[] = [
  { to: ROUTE_PATHS.HOME, label: 'Home', icon: House },
  { to: ROUTE_PATHS.GYM, label: 'Gym', icon: Dumbbell },
]
const RIGHT: NavItem[] = [
  { to: ROUTE_PATHS.FOOD, label: 'Food', icon: Utensils },
  { to: ROUTE_PATHS.ANALYSIS, label: 'Progress', icon: ChartNoAxesColumn },
]

const link = ({ to, label, icon: Icon }: NavItem) => (
  <NavLink
    key={to}
    to={to}
    className={({ isActive }) =>
      `flex min-h-11 min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-0.75 text-[11px] leading-3.5 font-bold ${isActive ? 'text-ink [&_svg]:text-primary' : 'text-ink-2'}`
    }
  >
    <Icon size={20} aria-hidden />
    {label}
  </NavLink>
)

type Props = {
  /** Opens the logging hub (the centre + button). */
  onLog: () => void
  /** Full-screen pages hide the bar. */
  hidden: boolean
}

// Mobile only (below lg): two links each side of a raised + button.
export const BottomNav = ({ onLog, hidden }: Props) => (
  <nav
    className={`fixed inset-x-0 bottom-0 ${hidden ? 'hidden' : 'flex'} h-[calc(72px+env(safe-area-inset-bottom))] items-center border-t border-line bg-surface px-2 pb-[env(safe-area-inset-bottom)] lg:hidden`}
    aria-label="Main"
  >
    {LEFT.map(link)}
    <button
      type="button"
      className="-mt-6 grid size-14 flex-none place-items-center rounded-full border-4 border-surface bg-primary text-on-primary"
      aria-label="Log something"
      aria-haspopup="dialog"
      onClick={onLog}
    >
      <Plus size={26} aria-hidden />
    </button>
    {RIGHT.map(link)}
  </nav>
)
