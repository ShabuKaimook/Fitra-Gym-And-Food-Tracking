import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'

const buttonVariants = cva(
  'inline-flex flex-none items-center justify-center gap-1.5 font-extrabold whitespace-nowrap disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        /** The page's main action: Save, Add. */
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        /** Next to primary: Cancel. */
        outline: 'border border-line bg-surface hover:bg-surface-2',
        /** Smaller actions in a card or list: + Custom. */
        soft: 'bg-primary-50 text-primary-ink hover:bg-primary-100',
        /** Text-only: Fewer, Edit. */
        ghost: 'text-primary-ink hover:bg-primary-50',
      },
      size: {
        sm: 'min-h-9 rounded-xl px-3 text-[13px]',
        md: 'min-h-11 rounded-2xl px-4 text-sm',
        lg: 'h-13 rounded-2xl px-6 text-base lg:h-11',
        icon: 'size-9 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>
type ButtonProps = ComponentProps<'button'> & {
  to?: undefined
  /** Saving or sending: disabled, and shows a spinner (see `spinner`). The label can say "Saving…". */
  loading?: boolean
  /** How loading looks. "label" (default): spinner before the label. "only": spinner in place of the
   * label, keeping the button's width. "none": disabled with no spinner. */
  spinner?: 'label' | 'only' | 'none'
}
// With `to` it's a router Link that looks like a button; without, a <button>.
type Props = Variants & (ButtonProps | (LinkProps & { loading?: undefined; spinner?: undefined }))

// The app's button. type defaults to "button" so one inside a form doesn't submit it by accident.
export const Button = ({ variant, size, className, loading, spinner = 'label', ...props }: Props) => {
  const showSpinner = loading && spinner !== 'none'
  // Loading keeps full colour, so the spinner doesn't look faded like a disabled button.
  const classes = cn(buttonVariants({ variant, size }), showSpinner && 'relative disabled:opacity-100', className)
  if (props.to !== undefined) return <Link {...props} className={classes} />
  const { disabled, children, ...rest } = props
  const icon = <Spinner className="size-[1.4em]" label="" />
  return (
    <button type="button" {...rest} disabled={disabled || loading} aria-busy={loading} className={classes}>
      {showSpinner && spinner === 'label' && icon}
      {showSpinner && spinner === 'only' ? (
        <>
          {/* Hidden but still there: it keeps the width and the name screen readers read. */}
          <span className="inline-flex items-center gap-1.5 opacity-0">{children}</span>
          <span className="absolute inset-0 grid place-items-center">{icon}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
