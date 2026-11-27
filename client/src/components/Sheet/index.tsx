import { cn } from 'cn'
import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  /** Read by screen readers as the sheet's name, e.g. "New exercise". */
  label: string
  /** Called once it has closed (Esc or close()); the parent's cue to unmount it. */
  onClose: () => void
  /** Content; as a function it gets close(), for a close button or after saving. */
  children: ReactNode | ((close: () => void) => ReactNode)
  /** Extra classes, e.g. "lg:m-auto lg:h-[90dvh] lg:max-w-5xl lg:rounded-[26px]" to be a large dialog on desktop. */
  className?: string
}

// A screen over the page (picker, new exercise) so what's underneath isn't lost: full screen with the
// grey page background. Native <dialog> gives focus trapping, Esc and an inert page. Mount it only
// while open: it opens on mount. The content draws its own header and close button.
export const Sheet = ({ label, onClose, children, className }: Props) => {
  // State, not a ref: close() goes to children during render, which a ref can't be read in.
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  useEffect(() => dialog?.showModal(), [dialog])
  const close = () => dialog?.close()

  return (
    <dialog
      ref={setDialog}
      aria-label={label}
      onClose={onClose}
      className={cn('m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-ink/40', className)}
    >
      {typeof children === 'function' ? children(close) : children}
    </dialog>
  )
}
