import type { SplitDay } from '@/services/WorkoutService/types/Workout'
import { WEEKDAYS } from '@/utils/date'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRef, useState } from 'react'
import { dayLabel } from '@/pages/split/split'

type Props = { days: (SplitDay | null)[]; onToggle: (i: number) => void }

// Mon … Sun; tapping a day switches it between training and rest. The ⓘ next to the label shows how in a tooltip.
export const WeekRow = ({ days, onToggle }: Props) => {
  const trainingCount = days.filter(Boolean).length
  const [showHint, setShowHint] = useState(false)
  const lastPointer = useRef('mouse')
  // Open or not when the press began; null for a click with no press (keyboard Enter / Space).
  const openOnPress = useRef<boolean | null>(null)
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0">
      <legend className="mb-1.5 flex w-full items-center p-0 text-[13px] font-bold text-ink-2">
        Training week
        <Tooltip
          open={showHint}
          // Radix opens it on hover and focus; a tap also focuses the button, so only a mouse may open it
          // that way. Taps toggle it in onClick. Closing (tap outside, Esc, mouse away) always goes through.
          onOpenChange={(open) => (!open || lastPointer.current === 'mouse') && setShowHint(open)}
        >
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="How to set rest days"
              onPointerEnter={(e) => (lastPointer.current = e.pointerType)}
              onPointerDown={(e) => {
                lastPointer.current = e.pointerType
                // Radix counts this press as "outside" the open tooltip and closes it before the click,
                // so the click goes by what it was when the press began.
                openOnPress.current = showHint
                e.preventDefault()
              }}
              onClick={(e) => {
                e.preventDefault()
                setShowHint(!(openOnPress.current ?? showHint))
                openOnPress.current = null
              }}
              className={`-my-2 ml-0.5 grid size-8 place-items-center rounded-full hover:bg-surface-2 ${showHint ? 'text-primary-ink' : 'text-ink-3'}`}
            >
              <Info size={15} aria-hidden />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Tap a day to make it rest, tap again to train</TooltipContent>
        </Tooltip>
        <span className="ml-auto font-semibold tabular-nums">{trainingCount} days</span>
      </legend>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={WEEKDAYS[i]}
            type="button"
            aria-pressed={!!day}
            aria-label={`${WEEKDAYS[i]}, ${day ? dayLabel(days, i) : 'rest'}`}
            onClick={() => onToggle(i)}
            className={`flex min-h-13 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-0.5 ${
              day ? 'border-primary-100 bg-primary-50 text-primary-ink' : 'border-dashed border-ink-3 text-ink-2'
            }`}
          >
            <b className="text-[13px]">{WEEKDAYS[i]}</b>
            <small className="w-full truncate text-center text-[11px] font-semibold">
              {day ? dayLabel(days, i) : 'Rest'}
            </small>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
