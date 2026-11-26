import { Card } from '@/components/Card'
import type { Micronutrient } from '@/services/FoodService/types/Food'
import { ChevronDown, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { cardLabel, muted } from './ui'

type Props = { micros: Micronutrient[] }

const MOBILE_ROWS = 4 // wireframe 1a

const row = ({ name, value, target, unit }: Micronutrient) => (
  // border-t (not -b) so the first collapsible row gets its divider from the 4th.
  <li key={name} className="flex justify-between gap-2 border-t border-line-soft py-1.25 text-[13px] font-bold">
    <span>{name}</span>
    {value === null ? (
      <span className="font-medium whitespace-nowrap text-ink-2 italic">No data</span>
    ) : (
      <span className={`${muted} font-medium whitespace-nowrap`}>
        {value.toLocaleString()} / {target.toLocaleString()} {unit}
      </span>
    )}
  </li>
)

// Mobile: first 4 rows, a chevron expands the rest. Desktop: every row, scrolling inside the card.
export const MicronutrientsCard = ({ micros }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const canExpand = micros.length > MOBILE_ROWS
  const collapsed = canExpand && !expanded

  return (
    <Card
      as="section"
      // lg:h-0 + min-h-full: the card fills its row but doesn't grow it, so the list scrolls instead.
      className="flex min-w-0 flex-col gap-2 [grid-area:micro] lg:h-0 lg:min-h-full lg:px-4.5 lg:[grid-area:auto]"
      aria-labelledby="micros-title"
    >
      <h2 id="micros-title" className={cardLabel}>
        <ListChecks size={15} aria-hidden />
        Micronutrients
      </h2>
      {micros.length === 0 ? (
        <p className={`${muted} italic`}>No data for this day</p>
      ) : (
        <div id="micros-list" className="lg:-mr-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          <ul className="[&>li:first-child]:border-t-0">{micros.slice(0, MOBILE_ROWS).map(row)}</ul>
          {/* Rows past 4 open with a height animation: grid rows 0fr → 1fr. invisible keeps the
              collapsed rows away from screen readers once they have slid shut. Desktop always shows them. */}
          <div
            className={`grid grid-rows-[1fr] transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${collapsed ? 'max-lg:invisible max-lg:grid-rows-[0fr]' : ''}`}
          >
            <ul className="min-h-0 overflow-hidden">{micros.slice(MOBILE_ROWS).map(row)}</ul>
          </div>
        </div>
      )}
      {canExpand && (
        <button
          type="button"
          className="-mb-1.5 grid min-h-8 place-items-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
          aria-expanded={expanded}
          aria-controls="micros-list"
          aria-label={expanded ? 'Show fewer micronutrients' : 'Show all micronutrients'}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown
            size={18}
            aria-hidden
            className={`transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </Card>
  )
}
