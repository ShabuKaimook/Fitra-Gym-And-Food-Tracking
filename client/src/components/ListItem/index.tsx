import { cn } from 'cn'
import type { ComponentProps, ElementType, ReactNode } from 'react'

const VARIANTS = {
  /** A line in a list; put dividers between rows with className. */
  row: 'py-2.5',
  /** A bordered card on its own, e.g. a link tile. */
  card: 'min-h-16 rounded-[18px] border border-line/80 bg-surface px-3.5 py-3',
}

type Props<T extends ElementType> = {
  /** The element: li in a list, label when the row ticks a checkbox, button or Link to open something. Default div. */
  as?: T
  variant?: keyof typeof VARIANTS
  /** Left: an icon, a photo, or a checkbox. */
  start?: ReactNode
  title: ReactNode
  /** Muted line under the title. "" keeps its height while it loads. */
  subtitle?: ReactNode
  /** Small label after the title, e.g. "In day", "Active". */
  badge?: ReactNode
  /** Right: a checkbox, a remove button, a chevron. */
  end?: ReactNode
} & Omit<ComponentProps<T>, 'as' | 'title'>

// One item in a list or a tile: something on the left, title and subtitle in the middle, an action on
// the right. Every slot but the title is optional.
export const ListItem = <T extends ElementType = 'div'>({
  as,
  variant = 'row',
  start,
  title,
  subtitle,
  badge,
  end,
  className,
  ...props
}: Props<T>) => {
  const Comp: ElementType = as ?? 'div'
  return (
    <Comp className={cn('flex items-center gap-3 text-left', VARIANTS[variant], className)} {...props}>
      {start}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm font-extrabold">
          <span className="truncate">{title}</span>
          {badge}
        </span>
        {subtitle !== undefined && <span className="min-h-4 truncate text-xs text-ink-2">{subtitle}</span>}
      </span>
      {end}
    </Comp>
  )
}
