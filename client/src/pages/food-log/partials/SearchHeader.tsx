import { IconButton } from '@/components/IconButton'
import { MealPicker } from '@/components/MealPicker'
import { TopBarTitle } from '@/components/TopBarTitle'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { ChevronLeft } from 'lucide-react'
import type { Meal } from '@/services/FoodService/types/Food'
import { useMealLabel } from '@/hooks/queries/useMeals'

type Props = { meal: Meal; onMeal: (meal: Meal) => void }

// Back (mobile only) and the meal as a centred title you can change. Desktop also gets a breadcrumb
// in the top bar.
export const SearchHeader = ({ meal, onMeal }: Props) => {
  const mealLabel = useMealLabel(meal)
  return (
    <header className="flex items-center gap-1">
      <TopBarTitle>
        <span className="text-sm text-ink-2">Food / Food search</span>
      </TopBarTitle>
      <IconButton label="Back" size="xl" to={ROUTE_PATHS.HOME} className="-ml-2.5 lg:hidden">
        <ChevronLeft size={22} aria-hidden />
      </IconButton>
      {/* Screen readers get the full heading; on screen the meal picker is the title. */}
      <h1 className="sr-only">Add to {mealLabel}</h1>
      <div className="flex flex-1 justify-center">
        <MealPicker variant="title" value={meal} onChange={onMeal} />
      </div>
      {/* Balances the back button so the picker is truly centred (mobile only, like the back button). */}
      <span className="-mr-2.5 size-11 flex-none lg:hidden" aria-hidden />
    </header>
  )
}
