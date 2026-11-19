import { ROUTE_PATHS } from '@/constants/routePaths'
import { useFoodSearch, useRecentFoods } from '@/hooks/queries/useFoods'
import { useDeferredValue, useState } from 'react'
import { mealLabel } from './food'
import { useFoodLog } from './hooks/useFoodLog'
import { CreateFoodCard } from './partials/CreateFoodCard'
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
      <section className={`flex min-w-0 flex-col gap-3 ${foodId ? 'max-lg:hidden' : ''}`}>
        <SearchHeader title={`Add to ${mealLabel(meal)}`} newFoodUrl={newFoodUrl} />
        <SearchBox value={query} onChange={setQuery} />
        <FilterChips label="Show" options={TABS} value={tab} onChange={setTab} />

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

        <CreateFoodCard newFoodUrl={newFoodUrl} />
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
