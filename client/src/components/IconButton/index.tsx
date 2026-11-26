import { Button } from '@/components/Button'
import { cn } from 'cn'
import type { ComponentProps, ReactNode } from 'react'

// Omit that keeps Button's button-or-link union intact.
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

type Props = OmitEach<ComponentProps<typeof Button>, 'variant' | 'size' | 'children' | 'aria-label'> & {
  /** What it does, for screen readers: "Close", "Back", "Remove Bench press". */
  label: string
  /** sm 32px, md 36px (default), lg 40px, xl 44px: the tap area, not the icon. */
  size?: keyof typeof SIZES
  /** muted: lighter grey that darkens on hover, for secondary actions like Remove and Edit. */
  tone?: 'default' | 'muted'
  /** The icon, e.g. <X size={18} aria-hidden />. */
  children: ReactNode
}

const SIZES = { sm: 'size-8', md: 'size-9', lg: 'size-10', xl: 'size-11' }
const TONES = { default: 'text-ink-2', muted: 'text-ink-3 hover:text-ink' }

// Round, icon-only button: Close, Back, Remove, Edit. Takes `to` to be a link, like Button.
export const IconButton = ({ label, size = 'md', tone = 'default', className, children, ...props }: Props) => (
  <Button
    {...props}
    variant="ghost"
    size="icon"
    aria-label={label}
    className={cn('rounded-full px-0 hover:bg-surface-2', SIZES[size], TONES[tone], className)}
  >
    {children}
  </Button>
)
