import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

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
// With `to` it's a router Link that looks like a button; without, a <button>.
type Props = Variants & ((ComponentProps<'button'> & { to?: undefined }) | LinkProps)

// The app's button. type defaults to "button" so one inside a form doesn't submit it by accident.
export const Button = ({ variant, size, className, ...props }: Props) => {
  const classes = cn(buttonVariants({ variant, size }), className)
  if (props.to !== undefined) return <Link {...props} className={classes} />
  return <button type="button" {...props} className={classes} />
}
