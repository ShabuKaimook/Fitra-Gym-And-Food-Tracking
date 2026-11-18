import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import type { DailyMacros, MacroAmount } from '@/services/FoodService/types/Food'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

export type Macros = Record<'protein' | 'carbs' | 'fat', MacroAmount>

const add = (a: MacroAmount, b: MacroAmount): MacroAmount => ({ grams: a.grams + b.grams, target: a.target + b.target })

/** Protein, carbs and fat added up over the days; null when no day has data. */
export const sumMacros = (days: DailyMacros[]): Macros | null =>
  days.length
    ? days.reduce<Macros>(
        (s, d) => ({ protein: add(s.protein, d.protein), carbs: add(s.carbs, d.carbs), fat: add(s.fat, d.fat) }),
        {
          protein: { grams: 0, target: 0 },
          carbs: { grams: 0, target: 0 },
          fat: { grams: 0, target: 0 },
        },
      )
    : null

// Total protein, carbs and fat from `from` to `to` (inclusive; one day if `to` is left out).
export const useMacros = (from: Date, to: Date = from) => {
  const [f, t] = [toDateKey(from), toDateKey(to)]
  return useQuery({
    queryKey: QUERY_KEYS.macros(f, t),
    queryFn: ({ signal }) => FoodService.getMacros(f, t, { signal }),
    select: sumMacros,
  })
}
