import type { Split } from '@/services/WorkoutService/types/Workout'
import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { WEEKDAYS } from '@/utils/date'
import { tag } from './ui'

// The splits as cards in a row that scrolls sideways (1e). The next card peeks in and fades out, and the
// arrow scrolls on, so it's clear there is more; both go once the end is reached.
export const SplitsRail = ({ splits }: { splits: Split[] }) => {
  const ref = useRef<HTMLUListElement>(null)
  const [atEnd, setAtEnd] = useState(true)
  const update = () => {
    const el = ref.current
    if (el) setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }
  // Also on resize: a wider screen can fit every card.
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [splits])

  return (
    // Mobile: bleeds to the screen's right edge (cancels main's padding) so the next card peeks.
    <div className="relative -mr-4 lg:mr-0">
      <ul
        ref={ref}
        onScroll={update}
        aria-label="My splits"
        className={`m-0 flex snap-x snap-mandatory [scrollbar-width:none] list-none gap-2.5 overflow-x-auto p-0 pr-4 lg:gap-3 lg:pr-0 [&::-webkit-scrollbar]:hidden ${atEnd ? '' : 'mask-r-from-75%'}`}
      >
        {splits.map((s) => (
          <li key={s.id} className="snap-start">
            <SplitCard split={s} />
          </li>
        ))}
      </ul>
      {!atEnd && (
        <button
          type="button"
          aria-label="Scroll splits"
          onClick={() => ref.current?.scrollBy({ left: ref.current.clientWidth * 0.8, behavior: 'smooth' })}
          className="absolute top-1/2 right-6 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:text-ink lg:right-2"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      )}
    </div>
  )
}

// Name, how many days a week, and which days, as seven little bars (Mon … Sun).
const SplitCard = ({ split }: { split: Split }) => {
  const trainingDays = split.days.flatMap((on, i) => (on ? WEEKDAYS[i] : []))
  return (
    <button
      type="button"
      className="flex h-24 w-33 flex-col justify-between rounded-[18px] border border-line/80 bg-surface p-3 text-left hover:border-primary-100 lg:h-26 lg:w-46.5 lg:p-3.5"
    >
      <span
        className={`${tag} ${split.kind === 'custom' ? 'bg-primary-50 text-primary-ink' : 'bg-surface-2 text-ink-2'}`}
      >
        {split.kind === 'custom' ? 'Custom' : 'Built-in'}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-extrabold">{split.name}</span>
        <span className="text-xs text-ink-2">
          {trainingDays.length} days<span className="sr-only">: {trainingDays.join(', ')}</span>
        </span>
      </span>
      <span className="flex gap-1" aria-hidden>
        {split.days.map((on, i) => (
          <i key={i} className={`h-1.5 flex-1 rounded-full ${on ? 'bg-primary' : 'bg-line'}`} />
        ))}
      </span>
    </button>
  )
}
