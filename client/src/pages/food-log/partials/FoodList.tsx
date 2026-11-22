import { Skeleton } from '@/components/Skeleton'
import type { Food } from '@/services/FoodService/types/Food'
import { MACROS } from '@/constants/nutrients'
import { Check, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { basisText, fmt } from '../food'

type Props = {
  foods: Food[] | undefined
  emptyText: string
  /** Where tapping the row goes: the food's form. */
  foodUrl: (food: Food) => string
  onQuickAdd: (food: Food) => void
  adding: boolean
}

// Search results (1j): picture, name, "kcal · basis", then protein / carbs / fat.
// Tapping the row opens the food's form (amount, edits); + adds one default serving.
export const FoodList = ({ foods, emptyText, foodUrl, onQuickAdd, adding }: Props) => (
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
        {foods.map((food) => (
          <li key={food.id} className="flex items-center rounded-2xl hover:bg-surface-2">
            <Link to={foodUrl(food)} className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl py-2 pl-2 text-left">
              <img
                src={food.image ?? '/illustrations/food-placeholder.svg'}
                alt=""
                className="size-15 flex-none rounded-2xl object-cover"
              />

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
                        {grams === null ? (
                          <>
                            <span aria-hidden>–</span>
                            <span className="sr-only">no data</span>
                          </>
                        ) : (
                          `${fmt(grams)} g`
                        )}
                      </span>
                    )
                  })}
                </span>
              </span>
            </Link>
            <QuickAddButton name={food.name} disabled={adding} onClick={() => onQuickAdd(food)} />
          </li>
        ))}
      </ul>
    )}
  </div>
)

// Phase lengths match spin-45, bump and unspin-45 in index.css. Timers, not animationend, so reduced motion
// (no animation) still steps through and resets.
const NEXT = {
  spin: { to: 'bump', ms: 200 },
  bump: { to: 'unspin', ms: 400 },
  unspin: { to: 'idle', ms: 200 },
} as const
type Phase = 'idle' | keyof typeof NEXT

// + that spins 45°, then turns into an orange check that bumps 1 → 1.3 → 1, then spins back from 45° to the outline +.
const QuickAddButton = ({ name, disabled, onClick }: { name: string; disabled: boolean; onClick: () => void }) => {
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (phase === 'idle') return
    const timer = setTimeout(() => setPhase(NEXT[phase].to), NEXT[phase].ms)
    return () => clearTimeout(timer)
  }, [phase])

  return (
    <button
      type="button"
      aria-label={`Quick add ${name}`}
      disabled={disabled}
      onClick={() => {
        setPhase('spin')
        onClick()
      }}
      className="grid size-18 flex-none place-items-center"
    >
      <span
        className={`grid size-6 place-items-center rounded-full border-2 border-primary motion-reduce:animate-none ${
          phase === 'bump' ? 'animate-bump bg-primary text-on-primary' : 'text-primary'
        }`}
      >
        {phase === 'bump' ? (
          <Check size={14} strokeWidth={3} aria-hidden />
        ) : (
          <Plus
            size={14}
            strokeWidth={3}
            aria-hidden
            className={
              phase === 'spin'
                ? 'animate-spin-45 motion-reduce:animate-none'
                : phase === 'unspin'
                  ? 'animate-unspin-45 motion-reduce:animate-none'
                  : ''
            }
          />
        )}
      </span>
    </button>
  )
}
