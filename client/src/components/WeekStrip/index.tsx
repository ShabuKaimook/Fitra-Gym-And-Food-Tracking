import { addDays, mondayOf } from '@/utils/date'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

// The caller owns the selected date; this component only shows it and reports taps.
type Props = {
  date: Date
  /** Days after this are future: disabled, empty ring. */
  today: Date
  onSelect: (d: Date) => void
  /** 0–1 calorie progress for a day. */
  progressOf: (d: Date) => number
  /** First and last day the strip has loaded (oldest Monday → this Sunday). Fetch progress for this range. */
  onRangeChange?: (from: Date, to: Date) => void
}

const arrow = 'grid h-11 w-6 place-items-center text-ink-2 hover:enabled:text-ink disabled:text-line'

const BATCH = 8 // older weeks added each time you reach the oldest one
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Whole weeks from b to a. Math.round absorbs the hour lost or gained at a DST change.
const weeksBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / WEEK_MS)
// Width of one week in px, measured because it's 100% of the track on mobile, 50% on desktop.
const weekWidth = (el: HTMLElement) => (el.firstElementChild as HTMLElement).offsetWidth

// Swipeable weeks (CSS scroll-snap), oldest on the left, this week on the right.
// Mobile shows 1 week, desktop 2. Arrows move one week either way.
// Older weeks load as you reach the start. Future days can't be picked.
//
// Weeks are identified by "ago": 0 = this week, 1 = last week, …
// They render oldest first, so the week at index i has ago = count - 1 - i.
export const WeekStrip = ({ date, today, onSelect, progressOf, onRangeChange }: Props) => {
  const track = useRef<HTMLDivElement>(null)
  const prevWidth = useRef(0) // track width before the last render, for effect ①
  const thisMonday = mondayOf(today)
  const selectedAgo = weeksBetween(thisMonday, mondayOf(date))

  const [loaded, setLoaded] = useState(selectedAgo + BATCH) // how many weeks exist in the track
  const [visibleAgo, setVisibleAgo] = useState(selectedAgo) // week on screen; drives the › button
  const count = Math.max(loaded, selectedAgo + 1) // a URL date can be older than what's loaded
  // Mondays oldest → newest; the last one is this week.
  const mondays = Array.from({ length: count }, (_, i) => addDays(thisMonday, -7 * (count - 1 - i)))

  // ① Weeks were prepended: everything shifted right, so shift scroll by the added width.
  // Layout effect so the fix lands before paint and the view never visibly jumps.
  useLayoutEffect(() => {
    const el = track.current!
    if (prevWidth.current) {
      el.style.scrollSnapType = 'none' // Safari re-snaps mid-adjust otherwise
      el.scrollLeft += el.scrollWidth - prevWidth.current
      el.style.scrollSnapType = ''
    }
    prevWidth.current = el.scrollWidth
  }, [count])

  // Report the loaded range whenever weeks are added, before paint so rings fill with the first frame.
  useLayoutEffect(() => {
    onRangeChange?.(mondays[0], addDays(thisMonday, 6))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the loaded weeks change
  }, [count])

  // ② Keep the selected week on screen (first render, or a date from the URL / back button).
  useLayoutEffect(() => {
    const el = track.current!
    const w = weekWidth(el)
    const left = (count - 1 - selectedAgo) * w
    // Already fully on screen (you tapped a day): leave the view alone. 1px slack for rounding.
    if (left >= el.scrollLeft - 1 && left + w <= el.scrollLeft + el.clientWidth + 1) return
    el.scrollLeft = left
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the selected week changes
  }, [selectedAgo])

  // ③ Which week is on screen: the one ≥60% visible. Reaching the oldest loads more (→ ①).
  // Plain effect: it only watches, nothing visible changes. Re-created so new weeks are observed.
  useEffect(() => {
    const el = track.current!
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const ago = Number((e.target as HTMLElement).dataset.ago)
          setVisibleAgo(ago)
          if (ago === count - 1) setLoaded(count + BATCH)
        }
      },
      { root: el, threshold: 0.6 },
    )
    for (const week of el.children) io.observe(week)
    return () => io.disconnect()
  }, [count])

  // Arrows only scroll (snap lines it up); they don't change the selected day.
  const step = (dir: number) => {
    const el = track.current!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * weekWidth(el), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-0.5 lg:mx-auto lg:w-full lg:max-w-205 lg:gap-2">
      <button type="button" className={arrow} aria-label="Previous week" onClick={() => step(-1)}>
        <ChevronLeft size={20} aria-hidden />
      </button>
      {/* Carousel: a horizontal scroller where each week snaps into place; overscroll-contain stops iOS back-swipe */}
      <div
        ref={track}
        className="flex snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Pick a day"
      >
        {mondays.map((monday, i) => (
          // One week: full width on mobile, half on desktop; snap-always = one week per flick.
          <div
            key={monday.getTime()}
            className="grid flex-[0_0_100%] snap-start snap-always grid-cols-7 gap-1 px-0.5 py-1 lg:flex-[0_0_50%] lg:px-1.5"
            data-ago={count - 1 - i}
          >
            {Array.from({ length: 7 }, (_, j) => {
              const d = addDays(monday, j)
              const future = d > today
              const selected = d.getTime() === date.getTime()
              const pct = future ? 0 : Math.min(1, progressOf(d)) * 100
              // Ring: conic-gradient fills pct% orange, the rest track grey; the inner disc makes it a stroke.
              return (
                <button
                  key={j}
                  type="button"
                  className={`flex flex-col items-center gap-1.5 rounded-xl px-1 pt-2 pb-2.5 text-[15px] font-extrabold tabular-nums ${selected ? 'bg-line text-primary-ink' : 'text-ink-2'}`}
                  aria-pressed={selected}
                  aria-label={d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  disabled={future}
                  onClick={() => onSelect(d)}
                >
                  <span
                    className="grid aspect-square min-h-0 w-full max-w-10 rounded-full bg-[conic-gradient(var(--color-primary)_var(--pct),var(--color-track)_0)] p-1.25 text-sm leading-none"
                    style={{ '--pct': `${pct}%` } as CSSProperties}
                  >
                    <span className="grid place-items-center rounded-full bg-canvas">
                      {d.toLocaleDateString('en-GB', { weekday: 'narrow' })}
                    </span>
                  </span>
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <button
        type="button"
        className={arrow}
        aria-label="Next week"
        disabled={visibleAgo === 0}
        onClick={() => step(1)}
      >
        <ChevronRight size={20} aria-hidden />
      </button>
    </div>
  )
}
