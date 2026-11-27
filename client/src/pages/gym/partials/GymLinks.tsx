import { ListItem } from '@/components/ListItem'
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
  <ListItem
    as="button"
    type="button"
    variant="card"
    className={`hover:bg-surface-2 ${className}`}
    start={
      <span className="grid size-9 flex-none place-items-center rounded-xl bg-primary-50 text-primary-ink">
        <Icon size={17} aria-hidden />
      </span>
    }
    title={title}
    subtitle={detail}
    end={<ChevronRight size={18} className="flex-none text-ink-3" aria-hidden />}
  />
)
