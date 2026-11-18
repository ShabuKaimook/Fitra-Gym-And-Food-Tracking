import type { Micronutrient } from '@/services/FoodService/types/Food'
import { ChevronDown, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { card, cardLabel, cardSurface, muted } from './ui'

type Props = { micros: Micronutrient[] }

const MOBILE_ROWS = 4 // wireframe 1a

// Mobile: first 4 rows, a chevron expands the rest. Desktop: every row, scrolling inside the card.
export const MicronutrientsCard = ({ micros }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const canExpand = micros.length > MOBILE_ROWS
  const collapsed = canExpand && !expanded

  return (
    <section
      // lg:h-0 + min-h-full: the card fills its row but doesn't grow it, so the list scrolls instead.
      className={`${card} ${cardSurface} [grid-area:micro] lg:h-0 lg:min-h-full lg:px-4.5 lg:[grid-area:auto]`}
      aria-labelledby="micros-title"
    >
      <h2 id="micros-title" className={cardLabel}>
        <ListChecks size={15} aria-hidden />
        Micronutrients
      </h2>
      {micros.length === 0 ? (
        <p className={`${muted} italic`}>No data for this day</p>
      ) : (
        <ul id="micros-list" className="lg:-mr-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          {micros.map(({ name, value, target, unit }) => (
            <li
              key={name}
              className={`flex justify-between gap-2 border-b border-line-soft py-1.25 text-[13px] font-bold last:border-b-0 ${collapsed ? 'max-lg:nth-4:border-b-0 max-lg:nth-[n+5]:hidden' : ''}`}
            >
              <span>{name}</span>
              {value === null ? (
                <span className="font-medium whitespace-nowrap text-ink-2 italic">No data</span>
              ) : (
                <span className={`${muted} font-medium whitespace-nowrap`}>
                  {value.toLocaleString()} / {target.toLocaleString()} {unit}
                </span>
              )}
            </li>
          ))}
        </ul>
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
          <ChevronDown size={18} aria-hidden className={expanded ? 'rotate-180' : ''} />
        </button>
      )}
    </section>
  )
}
