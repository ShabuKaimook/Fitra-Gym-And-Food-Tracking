import { ROUTE_PATHS } from '@/constants/routePaths'
import { useFoodSearch, useRecentFoods } from '@/hooks/queries/useFoods'
import { useDeferredValue, useState } from 'react'
import { useFoodLog } from './hooks/useFoodLog'
import { AddFoodLink } from './partials/AddFoodLink'
import { FilterChips } from './partials/FilterChips'
import { FoodList } from './partials/FoodList'
import { SearchBox } from './partials/SearchBox'
import { SearchHeader } from './partials/SearchHeader'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
] as const

// Food log (wireframe 1j): search, then a food opens its form to set the amount and add it to a meal.
const FoodLogPage = () => {
  const log = useFoodLog()
  const { meal } = log
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'recent'>('all')
  const search = useFoodSearch(useDeferredValue(query))
  const recent = useRecentFoods()

  const q = query.trim().toLowerCase()
  const foods =
    tab === 'all' ? search.data : recent.data?.filter((f) => `${f.name} ${f.brand ?? ''}`.toLowerCase().includes(q))
  const newFoodUrl = `${ROUTE_PATHS.FOOD_NEW}?${new URLSearchParams({ meal, ...(q && { name: query.trim() }) })}`

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Exactly the visible height, so the list scrolls inside it. Subtracts AppLayout's main padding:
          mobile 20px top + 96px bottom (the bottom nav and a gap); desktop the 56px top bar + 24px + 32px. */}
      <section
        className={`flex h-[calc(100dvh-116px-env(safe-area-inset-bottom))] min-w-0 flex-col gap-3 lg:h-[calc(100dvh-112px)]`}
      >
        <SearchHeader meal={meal} onMeal={log.setMeal} />
        <SearchBox value={query} onChange={setQuery} />
        <div className="flex items-center gap-2">
          <FilterChips label="Show" options={TABS} value={tab} onChange={setTab} />
          <div className="ml-auto">
            <AddFoodLink to={newFoodUrl} />
          </div>
        </div>

        <FoodList
          foods={foods}
          emptyText={tab === 'recent' && !q ? 'Nothing logged yet' : `No foods match “${query.trim()}”`}
          foodUrl={(f) => `${ROUTE_PATHS.FOOD_EDIT}?${new URLSearchParams({ food: f.id, meal })}`}
          onQuickAdd={log.quickAdd}
          adding={log.adding}
        />
      </section>
    </div>
  )
}

export default FoodLogPage
