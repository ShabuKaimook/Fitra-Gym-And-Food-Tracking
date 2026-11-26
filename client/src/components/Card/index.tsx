import { cn } from 'cn'
import type { ComponentProps, ElementType } from 'react'

const TONES = {
  /** White, the usual card. */
  default: 'border-line/80 bg-surface',
  /** Light grey: a panel beside the main content (picker, preview). */
  muted: 'border-line/80 bg-surface-2',
  /** Dashed outline: an empty slot waiting for data ("Not recorded"). */
  dashed: 'border-dashed border-ink-3 bg-surface-2',
}

type Props<T extends ElementType> = {
  /** The element to render: section, form, aside, ul… Default div. */
  as?: T
  tone?: keyof typeof TONES
} & Omit<ComponentProps<T>, 'as'>

// The app's rounded, bordered card. Padding defaults to p-3.5; layout (flex, gap…) and other padding
// go in className, which wins over the defaults.
export const Card = <T extends ElementType = 'div'>({ as, tone = 'default', className, ...props }: Props<T>) => {
  const Comp: ElementType = as ?? 'div'
  return <Comp className={cn('rounded-[20px] border p-3.5', TONES[tone], className)} {...props} />
}
