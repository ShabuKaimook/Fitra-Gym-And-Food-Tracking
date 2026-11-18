import type { summarizeCalories } from '@/hooks/queries/useCalories'
import type { Macros } from '@/hooks/queries/useMacros'
import type { Micronutrient } from '@/services/FoodService/types/Food'
import type { Loadable } from '@/types/Loadable'
import { CaloriesCard } from './CaloriesCard'
import { Skeleton } from '@/components/Skeleton'
import { MicronutrientsCard } from './MicronutrientsCard'
import { cardSkeleton, row } from './ui'

type Props = {
  calories: Loadable<ReturnType<typeof summarizeCalories>>
  macros: Loadable<Macros | null>
  micros: Loadable<Micronutrient[]>
}

// Calories + macros and micronutrients. Each card shows a skeleton until its data arrives.
export const NutritionRow = ({ calories, macros, micros }: Props) => (
  <div className={`${row} lg:grid-cols-[1.25fr_1fr]`}>
    {calories.isPending || macros.isPending ? (
      <Skeleton className={`${cardSkeleton} min-h-42 [grid-area:cal] lg:min-h-53.5`} />
    ) : (
      <CaloriesCard calories={calories.data?.total ?? null} macros={macros.data ?? null} />
    )}
    {micros.isPending ? (
      <Skeleton className={`${cardSkeleton} min-h-42 [grid-area:micro]`} />
    ) : (
      <MicronutrientsCard micros={micros.data ?? []} />
    )}
  </div>
)
