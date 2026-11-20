import { Skeleton } from '@/components/Skeleton'
import type { Food } from '@/services/FoodService/types/Food'
import { MACROS } from '@/constants/nutrients'
import { CirclePlus, Utensils } from 'lucide-react'
import { basisText, fmt } from '../food'

type Props = {
  foods: Food[] | undefined
  emptyText: string
  selectedId: string | null
  onSelect: (food: Food) => void
  onQuickAdd: (food: Food) => void
  adding: boolean
}

// Search results (1j): picture, name, "kcal · basis", then protein / carbs / fat.
// Tapping the row opens the amount; + adds one default serving.
export const FoodList = ({ foods, emptyText, selectedId, onSelect, onQuickAdd, adding }: Props) => (
  <div className="flex min-h-0 flex-1 flex-col rounded-[20px] border border-line/80 bg-surface p-1.5">
    {!foods ? (
      <div className="flex flex-col gap-1.5 p-1">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-19 rounded-2xl" />
        ))}
      </div>
    ) : foods.length === 0 ? (
      <p className="m-0 px-2.5 py-4 text-center text-[13px] text-ink-2">{emptyText}</p>
    ) : (
      // relative: the rows' sr-only labels are absolutely positioned; without it they escape this
      // scroll box and stretch the whole page.
      <ul className="relative m-0 flex min-h-0 list-none flex-col gap-0.5 overflow-y-auto overscroll-contain p-0">
        {foods.map((food) => {
          const selected = food.id === selectedId
          return (
            <li
              key={food.id}
              className={`flex items-center rounded-2xl ${selected ? 'bg-primary-50 ring-1 ring-primary-100 ring-inset' : ''}`}
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(food)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl py-2 pl-2 text-left"
              >
                {/* shortcut: placeholder until foods have photos (to-fix.md, food images). */}
                <span className="grid size-15 flex-none place-items-center rounded-2xl bg-primary-50 text-primary-ink">
                  <Utensils size={22} aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-extrabold">
                    {food.name}
                    {food.brand && <span className="font-semibold text-ink-2">, {food.brand}</span>}
                  </span>
                  <span className="truncate text-[13px] text-ink-2 tabular-nums">
                    {food.nutrients.calories.toLocaleString()} kcal · {basisText(food)}
                  </span>
                  <span className="flex flex-wrap gap-x-3 text-[13px] text-ink-2 tabular-nums">
                    {MACROS.map(({ key, label, icon: Icon, text }) => {
                      const grams = food.nutrients[key]
                      return (
                        <span key={key} className="inline-flex items-center gap-1">
                          <Icon size={14} className={text} aria-hidden />
                          <span className="sr-only">{label}</span>
                          {/* Missing stays visibly missing, never 0. */}
                          {grams === null ? <span className="italic">no data</span> : `${fmt(grams)} g`}
                        </span>
                      )
                    })}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Quick add ${food.name}`}
                disabled={adding}
                onClick={() => onQuickAdd(food)}
                className="grid size-18 flex-none place-items-center text-primary"
              >
                <CirclePlus size={24} aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>
    )}
  </div>
)
