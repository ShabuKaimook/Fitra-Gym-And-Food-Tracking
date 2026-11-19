import { ROUTE_PATHS } from '@/constants/routePaths'
import { Activity, Dumbbell, House, Images, Moon, Settings, TrendingUp, Utensils } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { avatar, USER, type NavItem } from './shared'

const SECTIONS: { section: string; items: NavItem[] }[] = [
  {
    section: 'Menu',
    items: [
      { to: ROUTE_PATHS.HOME, label: 'Home', icon: House },
      { to: ROUTE_PATHS.GYM, label: 'Gym', icon: Dumbbell },
      { to: ROUTE_PATHS.FOOD, label: 'Food', icon: Utensils },
    ],
  },
  {
    section: 'Progress',
    items: [
      { to: ROUTE_PATHS.ACTIVITY, label: 'Activity', icon: Activity },
      { to: ROUTE_PATHS.RECOVERY, label: 'Recovery', icon: Moon },
      { to: ROUTE_PATHS.BODY, label: 'Body & photos', icon: Images },
      { to: ROUTE_PATHS.ANALYSIS, label: 'Analysis', icon: TrendingUp },
    ],
  },
]

// Desktop only (from lg): logo, nav sections, and the user with a Settings link.
export const Sidebar = () => (
  <aside className="sticky top-0 hidden h-dvh flex-col gap-0.75 border-r border-line bg-surface px-3 pt-5 pb-4 lg:flex">
    <Link
      to={ROUTE_PATHS.HOME}
      className="mx-1.5 mb-5.5 flex items-center gap-2 text-[19px] font-extrabold tracking-[-0.6px]"
    >
      {/* 192px source keeps the 28px mark sharp on high-density screens */}
      <img src="/fitra-favicon/favicon-192x192.png" alt="" className="size-7 flex-none" />
      <span>
        <span className="text-primary">Fit</span>ra
      </span>
    </Link>

    <nav aria-label="Main">
      {SECTIONS.map(({ section, items }) => (
        <div key={section}>
          <div className="px-2.5 pt-2.5 pb-1.5 text-[11px] font-bold text-ink-2">{section}</div>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-10 items-center gap-2.5 rounded-xl px-2.5 py-2.25 text-[13px] font-bold ${isActive ? 'bg-primary-50 text-primary-ink [&_svg]:text-primary' : 'text-ink-2 hover:bg-surface-2'}`
              }
            >
              <Icon size={17} aria-hidden />
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>

    <div className="mt-auto flex items-center gap-2.25 border-t border-line px-1 pt-3">
      <div className={avatar}>{USER.initial}</div>
      <div>
        <div className="text-[13px] leading-tight font-bold">{USER.name}</div>
        <div className="text-xs leading-[1.3] text-ink-2">{USER.plan}</div>
      </div>
      <Link
        to={ROUTE_PATHS.PROFILE}
        className="ml-auto grid size-11 place-items-center rounded-xl text-ink-2 hover:bg-surface-2"
        aria-label="Settings"
      >
        <Settings size={16} aria-hidden />
      </Link>
    </div>
  </aside>
)
