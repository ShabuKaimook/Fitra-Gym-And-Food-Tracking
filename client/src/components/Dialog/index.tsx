import { IconButton } from '@/components/IconButton'
import { cn } from 'cn'
import { X } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useState, type ReactNode } from 'react'

type Props = {
  title: string
  /** Muted line under the title, e.g. "Mon, Upper, 5 exercises". */
  subtitle?: ReactNode
  /** Called once it has closed (X, Esc, backdrop or close()); the parent's cue to unmount it. */
  onClose: () => void
  /** Content below the header. As a function it gets close(), for a Cancel button or after saving. */
  children: ReactNode | ((close: () => void) => ReactNode)
  /** Extra classes on the dialog, e.g. "max-w-md" for a wider one. */
  className?: string
}

// Centred modal, or on phones a sheet near the bottom that rests on the keyboard. Native <dialog>
// gives focus trapping, Esc and an inert page. Mount it only while open: it opens on mount and
// focuses its first input, if it has one.
export const Dialog = ({ title, subtitle, onClose, children, className }: Props) => {
  // State, not a ref: close() goes to children during render, which a ref can't be read in.
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  const titleId = useId()
  const close = () => dialog?.close()

  // Layout effect: still inside the tap that opened it, which iOS needs before focus() may raise the keyboard.
  useLayoutEffect(() => {
    if (!dialog) return
    dialog.showModal()
    dialog.querySelector('input')?.focus()
  }, [dialog])

  // --kb = how much of the page the keyboard covers, so the phone sheet's bottom sits on top of it.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv || !dialog) return
    const update = () =>
      dialog.style.setProperty(
        '--kb',
        `${Math.max(0, document.documentElement.clientHeight - vv.offsetTop - vv.height)}px`,
      )
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [dialog])

  return (
    <dialog
      ref={setDialog}
      aria-labelledby={titleId}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-sm rounded-[26px] bg-surface p-5 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop:animate-fade-in backdrop:bg-ink/40 motion-reduce:backdrop:animate-none max-sm:mt-auto max-sm:mb-[calc(var(--kb,0px)+8px)] max-sm:w-[calc(100%-1rem)] max-sm:max-w-none',
        className,
      )}
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id={titleId} className="m-0 text-[19px] font-extrabold tracking-[-0.5px]">
              {title}
            </h2>
            {subtitle && <p className="m-0 text-[13px] text-ink-2">{subtitle}</p>}
          </div>
          <IconButton label="Close" onClick={close} className="-mr-2">
            <X size={18} aria-hidden />
          </IconButton>
        </div>
        {typeof children === 'function' ? children(close) : children}
      </div>
    </dialog>
  )
}
