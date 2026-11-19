import { ROUTE_PATHS } from '@/constants/routePaths'
import { useFoodSearch, useRecentFoods } from '@/hooks/queries/useFoods'
import { useDeferredValue, useState } from 'react'
import { useFoodLog } from './hooks/useFoodLog'
import { AddFoodLink } from './partials/AddFoodLink'
import { FilterChips } from './partials/FilterChips'
import { FoodList } from './partials/FoodList'
import { SearchBox } from './partials/SearchBox'
import { SearchHeader } from './partials/SearchHeader'
import { SelectedFood } from './partials/SelectedFood'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
] as const

// Food log (wireframe 1j): search → amount → add to a meal. Mobile shows the list or the amount
// screen; desktop shows both side by side.
const FoodLogPage = () => {
  const log = useFoodLog()
  const { meal, foodId, status } = log
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'recent'>('all')
  const search = useFoodSearch(useDeferredValue(query))
  const recent = useRecentFoods()

  const q = query.trim().toLowerCase()
  const foods =
    tab === 'all' ? search.data : recent.data?.filter((f) => `${f.name} ${f.brand ?? ''}`.toLowerCase().includes(q))
  const newFoodUrl = `${ROUTE_PATHS.FOOD_NEW}?${new URLSearchParams({ meal, ...(q && { name: query.trim() }) })}`

  return (
    <div className="grid items-start gap-4.5 lg:grid-cols-[1fr_20rem]">
      {/* Exactly the visible height, so the list scrolls inside it. Subtracts AppLayout's main padding:
          mobile 20px top + 96px bottom (the bottom nav and a gap); desktop the 56px top bar + 24px + 32px. */}
      <section
        className={`flex h-[calc(100dvh-116px-env(safe-area-inset-bottom))] min-w-0 flex-col gap-3 lg:h-[calc(100dvh-112px)] ${foodId ? 'max-lg:hidden' : ''}`}
      >
        <SearchHeader meal={meal} onMeal={log.setMeal} />
        <SearchBox value={query} onChange={setQuery} />
        <div className="flex items-center gap-2">
          <FilterChips label="Show" options={TABS} value={tab} onChange={setTab} />
          <div className="ml-auto">
            <AddFoodLink to={newFoodUrl} />
          </div>
        </div>

        <p
          role="status"
          className={`m-0 text-[13px] font-bold empty:hidden ${status.startsWith('Not') ? 'text-danger' : 'text-success'}`}
        >
          {status}
        </p>

        <FoodList
          foods={foods}
          emptyText={tab === 'recent' && !q ? 'Nothing logged yet' : `No foods match “${query.trim()}”`}
          selectedId={foodId}
          onSelect={(f) => log.select(f.id)}
          onQuickAdd={log.quickAdd}
          adding={log.adding}
        />
      </section>

      <SelectedFood
        foodId={foodId}
        unselect={log.unselect}
        add={log.add}
        adding={log.adding}
        meal={meal}
        onMeal={log.setMeal}
      />
    </div>
  )
}

export default FoodLogPage
