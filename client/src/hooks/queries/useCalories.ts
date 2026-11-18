import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import type { DailyCalories } from '@/services/FoodService/types/Food'
import { toDateKey } from '@/utils/date'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/** total is null when no day in the range has anything logged. */
export const summarizeCalories = (days: DailyCalories[]) => ({
  total: days.length
    ? { eaten: days.reduce((s, d) => s + d.eaten, 0), target: days.reduce((s, d) => s + d.target, 0) }
    : null,
  byDay: new Map(days.map((d) => [d.date, d])),
})

// Calories from `from` to `to` (inclusive; one day if `to` is left out): the range total plus each day.
// keepPrevious: while a new range loads, keep showing the old one (e.g. week rings) instead of nothing.
export const useCalories = (from: Date, to: Date = from, { keepPrevious = false } = {}) => {
  const [f, t] = [toDateKey(from), toDateKey(to)]
  return useQuery({
    queryKey: QUERY_KEYS.calories(f, t),
    queryFn: ({ signal }) => FoodService.getCalories(f, t, { signal }),
    select: summarizeCalories,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  })
}
