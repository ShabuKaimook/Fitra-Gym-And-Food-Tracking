import type { Split } from '@/services/WorkoutService/types/Workout'
import { ScrollRail } from '@/components/ScrollRail'
import { splitEditPath } from '@/constants/routePaths'
import { Link } from 'react-router-dom'
import { WEEKDAYS } from '@/utils/date'
import { tag } from './ui'

// The splits as cards in a row that scrolls sideways (1e); the next card peeks in so it's clear there's more.
export const SplitsRail = ({ splits }: { splits: Split[] }) => (
  <ScrollRail
    role="list"
    label="My splits"
    scrollLabel="Scroll splits"
    watch={splits}
    // Mobile: bleeds to the screen's right edge (cancels main's padding) so the next card peeks.
    className="-mr-4 lg:mr-0"
    rowClassName="gap-2.5 pr-4 lg:gap-3 lg:pr-0"
  >
    {splits.map((s) => (
      <div key={s.id} role="listitem" className="snap-start">
        <SplitCard split={s} />
      </div>
    ))}
  </ScrollRail>
)

// Name, how many days a week, and which days, as seven little bars (Mon … Sun). Opens the split's editor.
const SplitCard = ({ split }: { split: Split }) => {
  const trainingDays = split.days.flatMap((day, i) => (day ? WEEKDAYS[i] : []))
  return (
    <Link
      to={splitEditPath(split.id)}
      className="flex h-24 w-33 flex-col justify-between rounded-[18px] border border-line/80 bg-surface p-3 text-left hover:border-primary-100 lg:h-26 lg:w-46.5 lg:p-3.5"
    >
      <span
        className={`${tag} ${split.kind === 'custom' ? 'bg-primary-50 text-primary-ink' : 'bg-surface-2 text-ink-2'}`}
      >
        {split.kind === 'custom' ? 'Custom' : 'Built-in'}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-extrabold">{split.name}</span>
        <span className="text-xs text-ink-2">
          {trainingDays.length} days<span className="sr-only">: {trainingDays.join(', ')}</span>
        </span>
      </span>
      <span className="flex gap-1" aria-hidden>
        {split.days.map((day, i) => (
          <i key={i} className={`h-1.5 flex-1 rounded-full ${day ? 'bg-primary' : 'bg-line'}`} />
        ))}
      </span>
    </Link>
  )
}
