import { Skeleton } from '@/components/Skeleton'
import type { Food } from '@/services/FoodService/types/Food'
import { Plus, Utensils } from 'lucide-react'
import { describeFood, macroLine } from '../food'

type Props = {
  foods: Food[] | undefined
  emptyText: string
  selectedId: string | null
  onSelect: (food: Food) => void
  onQuickAdd: (food: Food) => void
  adding: boolean
}

// Mobile: picture, name and basis, kcal. Desktop: a table with a P / C / F column instead of the picture.
const cols = 'grid-cols-[2.375rem_1fr_auto] lg:grid-cols-[1fr_3.75rem_7rem]'

// Search results (1j). Tapping the row opens the amount; + adds one default serving.
export const FoodList = ({ foods, emptyText, selectedId, onSelect, onQuickAdd, adding }: Props) => (
  <div className="rounded-[20px] border border-line/80 bg-surface p-1.5">
    <div className={`hidden gap-2.5 py-1 pr-13 pl-2.5 text-[11px] font-bold text-ink-2 lg:grid ${cols}`}>
      <span>Food</span>
      <span>kcal</span>
      <span>P / C / F</span>
    </div>

    {!foods ? (
      <div className="flex flex-col gap-1.5 p-1">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-13 rounded-xl" />
        ))}
      </div>
    ) : foods.length === 0 ? (
      <p className="m-0 px-2.5 py-4 text-center text-[13px] text-ink-2">{emptyText}</p>
    ) : (
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {foods.map((food) => {
          const selected = food.id === selectedId
          return (
            <li
              key={food.id}
              className={`flex items-center rounded-xl ${selected ? 'bg-primary-50 ring-1 ring-primary-100 ring-inset' : ''}`}
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(food)}
                className={`grid min-w-0 flex-1 items-center gap-2.5 rounded-xl py-2 pl-2.5 text-left ${cols}`}
              >
                <span className="grid size-9.5 place-items-center rounded-xl border border-primary-100 bg-primary-50 text-ink-3 lg:hidden">
                  <Utensils size={16} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-bold">
                    {food.name}
                    {food.brand && <span className="hidden lg:inline">, {food.brand}</span>}
                  </span>
                  <span className="block truncate text-xs text-ink-2">{describeFood(food)}</span>
                </span>
                <span className="text-[13px] font-bold tabular-nums">{food.nutrients.calories}</span>
                <span className="hidden text-xs text-ink-2 tabular-nums lg:block">{macroLine(food)}</span>
              </button>
              <button
                type="button"
                aria-label={`Quick add ${food.name}`}
                disabled={adding}
                onClick={() => onQuickAdd(food)}
                className="grid size-11 flex-none place-items-center disabled:opacity-60"
              >
                <span
                  className={`grid size-7.5 place-items-center rounded-[10px] text-primary-ink ${selected ? 'bg-surface' : 'bg-primary-50'}`}
                >
                  <Plus size={15} aria-hidden />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    )}
  </div>
)
