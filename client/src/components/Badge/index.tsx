import { cn } from 'cn'
import type { ReactNode } from 'react'

const TONES = {
  /** Grey: plain facts, e.g. "Built-in", "In day". */
  neutral: 'bg-surface-2 text-ink-2',
  /** Orange: the user's own, e.g. "Custom". */
  primary: 'bg-primary-50 text-primary-ink',
  /** Green: running now, e.g. "Active plan". */
  activity: 'bg-activity-tint text-activity-ink',
}

type Props = { tone?: keyof typeof TONES; className?: string; children: ReactNode }

// Small coloured label pill.
export const Badge = ({ tone = 'neutral', className, children }: Props) => (
  <span
    className={cn(
      'inline-flex w-fit flex-none items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
      TONES[tone],
      className,
    )}
  >
    {children}
  </span>
)
