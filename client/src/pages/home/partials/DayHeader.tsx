import { muted } from './ui'

type Props = { date: Date; isToday: boolean }

// The title already shows the weekday unless it's today.
const formatDate = (d: Date, style: 'short' | 'long', withWeekday: boolean) =>
  d.toLocaleDateString('en-GB', { weekday: withWeekday ? style : undefined, day: 'numeric', month: style })

// "Today · Thu 19 Nov" or "Monday · 16 Nov" (long month on desktop).
export const DayHeader = ({ date, isToday }: Props) => (
  <header className="flex flex-wrap items-baseline gap-2.5">
    <h1 className="m-0 text-2xl leading-7.5 font-extrabold tracking-[-0.4px] lg:text-[30px] lg:leading-9">
      {isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'long' })}
    </h1>
    <span className={`${muted} lg:hidden`}>{formatDate(date, 'short', isToday)}</span>
    <span className="text-sm text-ink-2 max-lg:hidden">{formatDate(date, 'long', isToday)}</span>
  </header>
)
