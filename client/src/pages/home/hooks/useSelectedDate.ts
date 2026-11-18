import { startOfToday, toDateKey } from '@/utils/date'
import { useSearchParams } from 'react-router-dom'

// Reads ?date=YYYY-MM-DD (local time). Missing, invalid or future → today.
export const parseDateParam = (param: string | null, today = startOfToday()) => {
  const match = param?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return today
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  const valid = date.getMonth() === m - 1 && date.getDate() === d
  return valid && date <= today ? date : today
}

// The selected day lives in the URL so refresh and back button keep it.
export const useSelectedDate = () => {
  const [params, setParams] = useSearchParams()
  const today = startOfToday()
  const date = parseDateParam(params.get('date'), today)
  const isToday = date.getTime() === today.getTime()

  // Today or later → no param, so the URL stays clean.
  const select = (d: Date) => setParams(d >= today ? {} : { date: toDateKey(d) })

  return { date, today, isToday, select }
}
