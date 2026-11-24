import type { WorkoutSession } from '@/services/WorkoutService/types/Workout'
import { ChevronRight, History, LayoutList, Library, type LucideIcon } from 'lucide-react'

type Props = {
  templates: number | undefined
  lastSession: WorkoutSession | null | undefined
}

const shortDate = (date: string) =>
  new Date(`${date}T00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })

// Templates, the exercise library and (desktop; mobile has History in the header) workout history,
// as tappable rows. Counts show once loaded.
export const GymLinks = ({ templates, lastSession }: Props) => (
  <div className="grid gap-2 lg:grid-cols-3 lg:gap-3">
    <LinkRow
      icon={LayoutList}
      title="Templates"
      detail={templates === undefined ? '' : `${templates} saved workout${templates === 1 ? '' : 's'}`}
    />
    <LinkRow icon={Library} title="Exercise library" detail="Browse or create exercises" />
    <LinkRow
      className="max-lg:hidden"
      icon={History}
      title="Workout history"
      detail={
        lastSession
          ? `Last: ${lastSession.name}, ${shortDate(lastSession.date)}`
          : lastSession === null
            ? 'No workouts yet'
            : ''
      }
    />
  </div>
)

type RowProps = { icon: LucideIcon; title: string; detail: string; className?: string }

const LinkRow = ({ icon: Icon, title, detail, className = '' }: RowProps) => (
  <button
    type="button"
    className={`flex min-h-16 items-center gap-3 rounded-[18px] border border-line/80 bg-surface px-3.5 py-3 text-left hover:bg-surface-2 ${className}`}
  >
    <span className="grid size-9 flex-none place-items-center rounded-xl bg-primary-50 text-primary-ink">
      <Icon size={17} aria-hidden />
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="text-sm font-extrabold">{title}</span>
      <span className="min-h-4.5 truncate text-[13px] text-ink-2">{detail}</span>
    </span>
    <ChevronRight size={18} className="flex-none text-ink-3" aria-hidden />
  </button>
)
