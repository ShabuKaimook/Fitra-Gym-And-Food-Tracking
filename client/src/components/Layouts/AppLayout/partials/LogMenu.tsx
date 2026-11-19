import { ROUTE_PATHS } from '@/constants/routePaths'
import { Bike, Droplets, Dumbbell, Moon, Plus, Scale, Utensils, type LucideIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTodayWater } from './useTodayWater'

// shortcut: items without a log form yet open their module's page; link each to its form once built.
const ITEMS: { label: string; to: string; icon: LucideIcon; key: string }[] = [
  { label: 'Food', to: ROUTE_PATHS.FOOD_LOG, icon: Utensils, key: 'f' },
  { label: 'Start workout', to: ROUTE_PATHS.GYM, icon: Dumbbell, key: 'w' },
  { label: 'Cardio or steps', to: ROUTE_PATHS.ACTIVITY, icon: Bike, key: 'c' },
  { label: 'Body weight', to: ROUTE_PATHS.BODY, icon: Scale, key: 'b' },
  { label: 'Sleep', to: ROUTE_PATHS.RECOVERY, icon: Moon, key: 's' },
]

const kbd = 'rounded-[5px] border border-line bg-surface-2 px-1.5 text-[11px] font-semibold text-ink-2'
// Drops in on open (keyframe, works in every browser); fades back out on close where the browser
// supports transition-discrete (Chrome/Edge), elsewhere it just disappears.
const menuMotion =
  'animate-menu-in opacity-0 -translate-y-1.5 open:opacity-100 open:translate-y-0 transition-[opacity,translate,overlay,display] transition-discrete duration-150 ease-out motion-reduce:animate-none motion-reduce:transition-none'

const waterChip = 'min-h-8 rounded-full bg-water-tint px-3 text-xs font-bold text-water-ink disabled:opacity-60'

// Desktop logging hub (1d): the top bar's Log button opens a popover. The native popover API
// gives light dismiss and Esc. L toggles it; while open, each item's letter opens it.
export const LogMenu = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { status, add, adding } = useTodayWater()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return
      // The top bar only shows from lg (64rem); mobile uses the sheet.
      if (!window.matchMedia('(min-width: 64rem)').matches) return
      const menu = menuRef.current
      if (!menu) return
      const key = e.key.toLowerCase()
      if (key === 'l') {
        e.preventDefault()
        menu.togglePopover()
        return
      }
      const item = menu.matches(':popover-open') && ITEMS.find((i) => i.key === key)
      if (item) {
        e.preventDefault()
        menu.hidePopover()
        navigate(item.to)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <>
      <button
        type="button"
        popoverTarget="log-menu"
        aria-keyshortcuts="L"
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary pr-3 pl-3 text-sm font-extrabold text-on-primary"
      >
        <Plus size={16} aria-hidden />
        Log
      </button>

      {/* Fixed under the Log button: header padding (32px) + avatar and gap (44px) from the right. */}
      <div
        ref={menuRef}
        id="log-menu"
        popover="auto"
        aria-label="Log"
        className={`fixed inset-auto top-15 right-19 m-0 w-72.5 rounded-2xl border border-line bg-surface p-2.5 text-ink shadow-[0_20px_50px_rgba(17,24,39,0.16)] ${menuMotion}`}
      >
        <div className="flex items-center gap-1.5 px-2 pt-1 pb-1.5">
          <span className="text-sm font-extrabold">Log</span>
          <span className="ml-auto text-xs text-ink-2">Shortcut</span>
          <kbd className={kbd}>L</kbd>
        </div>
        {ITEMS.map(({ label, to, icon: Icon, key }) => (
          <Link
            key={label}
            to={to}
            aria-keyshortcuts={key.toUpperCase()}
            onClick={() => menuRef.current?.hidePopover()}
            className="flex min-h-10 items-center gap-2.5 rounded-[11px] px-2.5 text-[13px] font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink"
          >
            <Icon size={16} aria-hidden />
            {label}
            <kbd className={`${kbd} ml-auto`}>{key.toUpperCase()}</kbd>
          </Link>
        ))}
        <div className="mt-1 flex items-center gap-1.5 border-t border-line px-2 pt-2.25 pb-0.5">
          <Droplets size={15} className="flex-none text-water-ink" aria-hidden />
          <div className="mr-auto min-w-0">
            <div className="text-[13px] font-bold">Water</div>
            <div className="truncate text-xs text-ink-2 tabular-nums" aria-live="polite">
              {status}
            </div>
          </div>
          <button type="button" className={waterChip} disabled={adding} onClick={() => add(250)}>
            +250
          </button>
          <button type="button" className={waterChip} disabled={adding} onClick={() => add(500)}>
            +500
          </button>
        </div>
      </div>
    </>
  )
}
