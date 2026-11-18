import { TopBarTitle } from '@/components/TopBarTitle'
import { muted } from './ui'

type Props = { date: Date; isToday: boolean }

// The title already shows the weekday unless it's today.
const formatDate = (d: Date, style: 'short' | 'long', withWeekday: boolean) =>
  d.toLocaleDateString('en-GB', { weekday: withWeekday ? style : undefined, day: 'numeric', month: style })

// "Today · Thu 19 Nov" or "Monday · 16 Nov". Mobile: top of the page. Desktop: in the top bar, long month.
export const DayHeader = ({ date, isToday }: Props) => {
  const title = isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'long' })

  return (
    <>
      <header className="flex flex-wrap items-baseline gap-2.5 lg:hidden">
        <h1 className="m-0 text-2xl leading-7.5 font-extrabold tracking-[-0.4px]">{title}</h1>
        <span className={muted}>{formatDate(date, 'short', isToday)}</span>
      </header>
      <TopBarTitle>
        <h1 className="m-0 truncate text-xl font-extrabold tracking-[-0.4px]">{title}</h1>
        <span className="text-sm whitespace-nowrap text-ink-2">{formatDate(date, 'long', isToday)}</span>
      </TopBarTitle>
    </>
  )
}
