import type { Macros } from '@/hooks/queries/useMacros'
import { Flame } from 'lucide-react'
import type { CSSProperties } from 'react'
import { ProgressBar } from './ProgressBar'
import { card, cardLabel, cardSurface, muted } from './ui'

/** null = nothing logged that day. */
type Props = { calories: { eaten: number; target: number } | null; macros: Macros | null }

const MACROS = [
  { key: 'protein', label: 'Protein', color: 'var(--color-protein)' },
  { key: 'carbs', label: 'Carbs', color: 'var(--color-carbs)' },
  { key: 'fat', label: 'Fat', color: 'var(--color-fat)' },
] as const

export const CaloriesCard = ({ calories, macros }: Props) => {
  const pct = calories ? Math.min(100, (calories.eaten / calories.target) * 100) : 0

  return (
    <section
      className={`${card} ${cardSurface} [grid-area:cal] lg:px-5.5 lg:py-4.5 lg:[grid-area:auto]`}
      aria-labelledby="calories-title"
    >
      <h2 id="calories-title" className={cardLabel}>
        <Flame size={15} aria-hidden />
        Calories and macros
      </h2>
      <div className="flex items-center gap-4 lg:gap-7">
        {/* Ring: conic fill, with an inner disc that leaves an 11px (15px desktop) stroke */}
        <div
          className="grid size-28 flex-none rounded-full bg-[conic-gradient(var(--color-primary)_var(--pct),var(--color-primary-50)_0)] p-2.75 lg:size-37.5 lg:p-3.75"
          style={{ '--pct': `${pct}%` } as CSSProperties}
          role="img"
          aria-label={
            calories
              ? `${calories.eaten.toLocaleString()} of ${calories.target.toLocaleString()} kcal eaten`
              : 'No calories logged'
          }
        >
          <div className="grid place-content-center rounded-full bg-surface text-center">
            {calories ? (
              <>
                <div className="text-[23px] leading-none font-extrabold tracking-[-0.8px] tabular-nums lg:text-[31px]">
                  {calories.eaten.toLocaleString()}
                </div>
                <div className={muted}>kcal</div>
                <div className="mt-1 text-xs text-ink-2 tabular-nums">
                  {Math.max(0, calories.target - calories.eaten).toLocaleString()} left
                </div>
              </>
            ) : (
              <div className={`${muted} px-3 italic`}>Nothing logged</div>
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:gap-3.25">
          {MACROS.map(({ key, label, color }) => {
            const m = macros?.[key]
            return (
              <div
                key={key}
                className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 [grid-template-areas:'name_val'_'bar_bar'] lg:grid-cols-[58px_1fr_76px] lg:gap-2 lg:[grid-template-areas:'name_bar_val']"
              >
                <span className="text-[13px] font-bold [grid-area:name] lg:font-medium lg:text-ink-2">{label}</span>
                <ProgressBar value={m?.grams ?? 0} max={m?.target ?? 1} color={color} className="[grid-area:bar]" />
                <span className="text-right text-[13px] whitespace-nowrap text-ink-2 tabular-nums [grid-area:val]">
                  {m ? `${m.grams} / ${m.target}g` : '–'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
