import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import type { DailyMicronutrients, Micronutrient } from '@/services/FoodService/types/Food'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// null means "not tracked", so it only wins when both sides are null.
const addNullable = (a: number | null, b: number | null) => (a === null ? b : b === null ? a : a + b)

/** Each nutrient added up over the days, in first-seen order. value stays null if never tracked. */
export const sumMicronutrients = (days: DailyMicronutrients[]): Micronutrient[] => {
  const totals = new Map<string, Micronutrient>()
  for (const { items } of days) {
    for (const m of items) {
      const t = totals.get(m.name)
      totals.set(m.name, t ? { ...t, value: addNullable(t.value, m.value), target: t.target + m.target } : { ...m })
    }
  }
  return [...totals.values()]
}

// Micronutrient totals from `from` to `to` (inclusive; one day if `to` is left out). Empty list = no data.
export const useMicronutrients = (from: Date, to: Date = from) => {
  const [f, t] = [toDateKey(from), toDateKey(to)]
  return useQuery({
    queryKey: QUERY_KEYS.micronutrients(f, t),
    queryFn: ({ signal }) => FoodService.getMicronutrients(f, t, { signal }),
    select: sumMicronutrients,
  })
}
