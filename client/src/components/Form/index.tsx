import { Button } from '@/components/Button'
import { TopBarTitle } from '@/components/TopBarTitle'
import { useFullScreen } from '@/hooks/useFullScreen'
import { useInlineValidation } from '@/hooks/useInlineValidation'
import { ChevronLeft } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Inputs and selects (design-system §5 Input). user-invalid: only shows the error after the user
// touched the field or tried to submit, so an empty form doesn't start out red.
// inputBase has no font size: add your own, 16px or more, or iOS zooms in on focus.
export const inputBase =
  'min-h-11 w-full min-w-0 rounded-[14px] border border-line bg-surface-2 px-3 text-ink tabular-nums placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-offset-0 user-invalid:border-2 user-invalid:border-danger'
export const input = `${inputBase} text-base`

// A white card grouping related fields.
export const formCard = 'flex flex-col gap-3 rounded-[20px] border border-line/80 bg-surface p-4'

type FieldProps = {
  label: ReactNode
  unit?: string
  hint?: string
  /** One row: label, small input, unit (the nutrient rows in a card). */
  inline?: boolean
  children: ReactNode
}

// Label above its control (or beside it when inline). Wrapping in <label> ties them together without ids.
export const Field = ({ label, unit, hint, inline, children }: FieldProps) =>
  inline ? (
    <label className="grid grid-cols-[1fr_6rem_2.25rem] items-center gap-2 border-b border-line-soft py-1.5 last:border-b-0">
      <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">{label}</span>
      {children}
      <span className="text-xs text-ink-2">{unit}</span>
    </label>
  ) : (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink-2">{label}</span>
      <span className="flex items-center gap-2">
        {children}
        {unit && <span className="w-9 flex-none text-[13px] text-ink-2">{unit}</span>}
      </span>
      {hint && <span className="text-xs text-ink-2">{hint}</span>}
    </label>
  )

type FormPageProps = {
  title: string
  /** Where Back goes. */
  backTo: string
  submitLabel: string
  onSubmit: () => void
  pending?: boolean
  /** Shown above the submit button, e.g. when saving failed. */
  error?: string
  /** Fills a band at the top (e.g. an <img> with size-full object-cover); the header sits on it. */
  cover?: ReactNode
  /** Replaces the visible title in the header, e.g. a meal picker. The title stays for screen readers. */
  headerCenter?: ReactNode
  /** Fields that describe the thing (e.g. name, unit): under the cover on mobile, left card on desktop. */
  side?: ReactNode
  children: ReactNode
}

const backBtn = 'grid size-11 flex-none place-items-center rounded-full'

// Shell shared by every log page: back + title (optionally on a cover band), the fields, and a
// submit button that stays in reach at the bottom. Native validation (required, min, max) runs
// before onSubmit is called.
export const FormPage = ({
  title,
  backTo,
  submitLabel,
  onSubmit,
  pending,
  error,
  cover,
  headerCenter,
  side,
  children,
}: FormPageProps) => {
  const fullScreen = useFullScreen()
  const { attach, message: invalidMessage, clear: clearInvalid } = useInlineValidation()
  // A failed check (our own message) wins over a failed save.
  const message = invalidMessage || error
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const header = (
    <header className="relative flex items-center gap-2">
      <Link
        to={backTo}
        aria-label="Back"
        className={`${backBtn} ${cover ? 'bg-surface/70 text-ink backdrop-blur-sm' : '-ml-2.5 text-ink-2 hover:bg-surface-2'}`}
      >
        <ChevronLeft size={22} aria-hidden />
      </Link>
      <h1
        className={`m-0 text-2xl leading-7.5 font-extrabold tracking-[-0.4px] lg:hidden ${headerCenter ? 'sr-only' : ''}`}
      >
        {title}
      </h1>
      {headerCenter && <div className="flex flex-1 justify-center">{headerCenter}</div>}
      {/* Balances the back button so headerCenter is truly centred. */}
      {headerCenter && <span className="size-11 flex-none" aria-hidden />}
    </header>
  )

  const top = cover ? (
    // Full bleed on mobile (cancels main's padding), a rounded panel on desktop. The cover fills the
    // band behind the header; the gradient shows while it loads.
    <div className="relative -mx-4 -mt-5 h-56 overflow-hidden rounded-b-[28px] bg-linear-to-b from-primary-100 to-primary-50 px-4 pt-3 sm:mx-0 sm:mt-0 sm:h-48 sm:rounded-[28px]">
      <div className="absolute inset-0">{cover}</div>
      {header}
    </div>
  ) : (
    header
  )

  const footer = (
    // Stays at the bottom while the fields scroll: above the mobile bottom nav (72px + safe area),
    // or above the home bar when the page is full screen and the nav is hidden.
    <div
      className={`sticky flex flex-col gap-2 lg:bottom-6 ${fullScreen ? 'bottom-[calc(12px+env(safe-area-inset-bottom))]' : 'bottom-[calc(84px+env(safe-area-inset-bottom))]'}`}
    >
      {message && (
        <p role="alert" className="m-0 rounded-xl bg-surface px-3 py-2 text-[13px] font-bold text-danger">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" loading={pending} className="shadow-[0_8px_24px_-6px_rgba(255,122,26,0.45)]">
        {pending ? 'Saving' : submitLabel}
      </Button>
    </div>
  )

  const topBarTitle = (
    <TopBarTitle>
      <h1 className="m-0 truncate text-xl tracking-[-0.4px]">{title}</h1>
    </TopBarTitle>
  )

  if (!side) {
    return (
      <form
        ref={attach}
        onSubmit={submit}
        onInput={clearInvalid}
        className="mx-auto flex w-full max-w-xl flex-col gap-4"
      >
        {top}
        {topBarTitle}
        {children}
        {footer}
      </form>
    )
  }

  // With `side`: one column on mobile; on desktop a card on the left (cover + side, stays put while
  // scrolling) and the fields with the submit button on the right.
  return (
    <form
      ref={attach}
      onSubmit={submit}
      onInput={clearInvalid}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 lg:grid lg:max-w-4xl lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-6"
    >
      {topBarTitle}
      <div className="flex flex-col gap-4 sm:sticky sm:rounded-[28px] lg:top-20 lg:border lg:border-line/80 lg:bg-surface lg:p-2 lg:pb-5">
        <div className="mb-2">{top}</div>
        <div className="flex flex-col gap-4 lg:px-3">{side}</div>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {children}
        {footer}
      </div>
    </form>
  )
}
