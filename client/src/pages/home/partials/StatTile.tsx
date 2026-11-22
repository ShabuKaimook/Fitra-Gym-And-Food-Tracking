import { SquarePen, Plus, type LucideIcon } from 'lucide-react'
import { ProgressBar } from '@/components/ProgressBar'
import { btnBase, card, cardSurface, muted } from './ui'

type Tone = 'activity' | 'water' | 'sleep'

type Props = {
  label: string
  icon: LucideIcon
  /** null → "Not recorded" with an add button (never a 0 bar) */
  value: string | null
  target?: string
  /** Small line under the value, e.g. "Quality 7/10" */
  detail?: string
  progress?: { value: number; max: number }
  /** Data colour family: --color-{tone}, -tint, -ink */
  tone?: Tone
  addLabel: string
  /** Opens the edit modal; also used by the empty state's add button */
  onEdit?: () => void
  className?: string
}

// Full class names so Tailwind can find them.
const ICON_TONE: Record<Tone, string> = {
  activity: 'bg-activity-tint text-activity-ink',
  water: 'bg-water-tint text-water-ink',
  sleep: 'bg-sleep-tint text-sleep-ink',
}

export const StatTile = ({
  label,
  icon: Icon,
  value,
  target,
  detail,
  progress,
  tone,
  addLabel,
  onEdit,
  className = '',
}: Props) => {
  const empty = value === null
  const iconClass = tone && !empty ? ICON_TONE[tone] : 'bg-surface text-ink-2'

  return (
    <section className={`${card} ${empty ? 'border-dashed border-ink-3 bg-surface-2' : cardSurface} ${className}`}>
      <h2 className="m-0 flex items-center gap-2 text-[13px] font-bold">
        <span className={`grid size-7.5 flex-none place-items-center rounded-[10px] ${iconClass}`}>
          <Icon size={15} aria-hidden />
        </span>
        {label}
        {onEdit && !empty && (
          <button
            type="button"
            aria-label={`Edit ${label.toLowerCase()}`}
            onClick={onEdit}
            className="-my-1 -mr-1.5 ml-auto grid size-8 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            <SquarePen size={15} aria-hidden />
          </button>
        )}
      </h2>
      {empty ? (
        <>
          <div className="text-[15px] leading-6 font-extrabold tracking-[-0.4px] text-ink-2">Not recorded</div>
          <button
            type="button"
            onClick={onEdit}
            className={`${btnBase} min-h-9 self-start rounded-xl bg-primary-50 px-3 text-[13px] text-primary-ink hover:bg-primary-100`}
          >
            <Plus size={13} aria-hidden />
            {addLabel}
          </button>
        </>
      ) : (
        <>
          <div className="truncate">
            <span className="text-lg leading-6 font-extrabold tracking-[-0.4px] tabular-nums">{value}</span>
            {target && <span className={muted}> / {target}</span>}
          </div>
          {detail && <div className={muted}>{detail}</div>}
          {progress && <ProgressBar {...progress} color={`var(--color-${tone ?? 'primary'})`} />}
        </>
      )}
    </section>
  )
}
