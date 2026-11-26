import { cn } from 'cn'
import type { ReactNode } from 'react'

type Props = {
  /** Pressed: orange. */
  on: boolean
  onClick: () => void
  /** sm 32px (a short row like All / Recent), md 36px (default). */
  size?: 'sm' | 'md'
  className?: string
  /** The label, optionally with a small icon before it. */
  children: ReactNode
}

// Pill that toggles on and off: filters (muscle, equipment, All / Recent) and multi-picks (secondary muscles).
// Put a row of them in an element with role="group" and an aria-label.
export const ToggleChip = ({ on, onClick, size = 'md', className, children }: Props) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={cn(
      'inline-flex flex-none items-center gap-1 rounded-full border px-3 font-bold whitespace-nowrap',
      size === 'sm' ? 'min-h-8 text-xs' : 'min-h-9 text-[13px]',
      on ? 'border-primary bg-primary-50 text-primary-ink' : 'border-line bg-surface text-ink-2 hover:bg-surface-2',
      className,
    )}
  >
    {children}
  </button>
)
