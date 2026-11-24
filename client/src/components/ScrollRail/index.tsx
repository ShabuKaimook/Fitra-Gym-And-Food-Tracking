import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  /** The row's role and name, e.g. role "list" / "tablist" with label "My splits". */
  role: string
  label: string
  /** Names the arrow: "Scroll splits". */
  scrollLabel: string
  /** Re-measure when this changes (the items), since the row may start or stop overflowing. */
  watch?: unknown
  /** Layout of the outer box, e.g. a negative margin so items bleed to the screen edge. */
  className?: string
  /** Gap and padding of the row itself. */
  rowClassName?: string
  children: ReactNode
}

// A row that scrolls sideways (wireframes 1e, 1f). While there is more to the right, the last visible item
// fades out and an arrow scrolls on; both go once the end is reached or everything fits.
export const ScrollRail = ({ role, label, scrollLabel, watch, className = '', rowClassName = '', children }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [atEnd, setAtEnd] = useState(true)
  const update = () => {
    const el = ref.current
    if (el) setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }
  // Also on resize: a wider screen can fit every item.
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [watch])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        role={role}
        aria-label={label}
        onScroll={update}
        className={`flex snap-x snap-mandatory [scrollbar-none] overflow-x-auto [&::-webkit-scrollbar]:hidden ${rowClassName} ${atEnd ? '' : 'mask-r-from-75%'}`}
      >
        {children}
      </div>
      {!atEnd && (
        <button
          type="button"
          aria-label={scrollLabel}
          onClick={() => ref.current?.scrollBy({ left: ref.current.clientWidth * 0.8, behavior: 'smooth' })}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:text-ink"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      )}
    </div>
  )
}
