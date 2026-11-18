import { ROUTE_PATHS } from '@/constants/routePaths'
import {
  Activity,
  ChartNoAxesColumn,
  Dumbbell,
  House,
  Images,
  Moon,
  Plus,
  Settings,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

type NavItem = { to: string; label: string; icon: LucideIcon }

/** Passed to pages through <Outlet context>; read it with TopBarTitle. */
export type AppLayoutContext = { titleSlot: HTMLElement | null }

const SIDEBAR: { section: string; items: NavItem[] }[] = [
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

const BOTTOM_LEFT: NavItem[] = [
  { to: ROUTE_PATHS.HOME, label: 'Home', icon: House },
  { to: ROUTE_PATHS.GYM, label: 'Gym', icon: Dumbbell },
]
const BOTTOM_RIGHT: NavItem[] = [
  { to: ROUTE_PATHS.FOOD, label: 'Food', icon: Utensils },
  { to: ROUTE_PATHS.ANALYSIS, label: 'Progress', icon: ChartNoAxesColumn },
]

// shortcut: hard-coded user until auth/profile exists, then read it from a query hook.
const USER = { name: 'Alex', initial: 'A', plan: 'Personal' }

const avatar =
  'grid size-8 flex-none place-items-center rounded-full bg-avatar text-[13px] font-extrabold text-avatar-ink'

const bottomLink = ({ to, label, icon: Icon }: NavItem) => (
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

// Mobile first: bottom nav. From lg: sidebar + top bar.
export const AppLayout = () => {
  // The top bar's left side is filled by the page (TopBarTitle portals into it).
  const [titleSlot, setTitleSlot] = useState<HTMLDivElement | null>(null)

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[220px_1fr]">
      {/* SIDEBAR Appear when lg display */}
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
          {SIDEBAR.map(({ section, items }) => (
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

      {/* Header Appear when lg display */}
      <div className="min-w-0">
        <header className="sticky top-0 z-1 hidden h-14 items-center gap-3 border-b border-line bg-surface/85 px-8 backdrop-blur-sm lg:flex">
          <div ref={setTitleSlot} className="mr-auto flex min-w-0 items-baseline gap-2.5" />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary pr-4 pl-3 text-sm font-extrabold text-on-primary"
          >
            <Plus size={16} aria-hidden />
            Log
          </button>
          <div className={avatar} aria-hidden>
            {USER.initial}
          </div>
        </header>
        <main className="mx-auto max-w-300 px-4 pt-5 pb-[calc(96px+env(safe-area-inset-bottom))] lg:px-8 lg:pt-6 lg:pb-8">
          <Outlet context={{ titleSlot } satisfies AppLayoutContext} />
        </main>
      </div>

      {/* Bottom Bar Disappear when lg display*/}
      <nav
        className="fixed inset-x-0 bottom-0 flex h-[calc(72px+env(safe-area-inset-bottom))] items-center border-t border-line bg-surface px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Main"
      >
        {BOTTOM_LEFT.map(bottomLink)}
        <button
          type="button"
          className="-mt-6 grid size-14 flex-none place-items-center rounded-full border-4 border-surface bg-primary text-on-primary"
          aria-label="Log something"
        >
          <Plus size={26} aria-hidden />
        </button>
        {BOTTOM_RIGHT.map(bottomLink)}
      </nav>
    </div>
  )
}
