import { Card } from '@/components/Card'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/Button'
import { SquarePen, Plus, type LucideIcon } from 'lucide-react'
import { ProgressBar } from '@/components/ProgressBar'
import { muted } from './ui'

type Tone = 'activity' | 'water' | 'sleep'

type Props = {
  label: string
  icon: LucideIcon
  /** null → "Not recorded" with an add button (never a 0 bar) */
  value: string | null
  target?: string
  /** Small muted line under the value (or under "Not recorded"), e.g. "Quality 7/10" */
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
    <Card as="section" tone={empty ? 'dashed' : 'default'} className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <h2 className="m-0 flex items-center gap-2 text-[13px] font-bold">
        <span className={`grid size-7.5 flex-none place-items-center rounded-[10px] ${iconClass}`}>
          <Icon size={15} aria-hidden />
        </span>
        {label}
        {onEdit && !empty && (
          <IconButton
            label={`Edit ${label.toLowerCase()}`}
            size="sm"
            tone="muted"
            onClick={onEdit}
            className="-my-1 -mr-1.5 ml-auto"
          >
            <SquarePen size={15} aria-hidden />
          </IconButton>
        )}
      </h2>
      {empty ? (
        <>
          <div className="text-[15px] leading-6 font-extrabold tracking-[-0.4px] text-ink-2">Not recorded</div>
          {detail && <div className={muted}>{detail}</div>}
          <Button variant="soft" size="sm" onClick={onEdit} className="self-start">
            <Plus size={13} aria-hidden />
            {addLabel}
          </Button>
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
    </Card>
  )
}
