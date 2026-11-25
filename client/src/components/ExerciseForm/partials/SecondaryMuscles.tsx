import type { SecondaryMuscle } from '@/services/WorkoutService/types/Workout'
import { useState } from 'react'

type Props = { options: SecondaryMuscle[]; value: SecondaryMuscle[]; onToggle: (m: SecondaryMuscle) => void }

// How many chips show before "+ More" (picked ones always show).
const FIRST = 5

// Optional muscles it also works, as toggle chips.
export const SecondaryMuscles = ({ options, value, onToggle }: Props) => {
  const [all, setAll] = useState(false)
  const shown = all ? options : options.filter((m, i) => i < FIRST || value.includes(m))
  return (
    <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
      <legend className="mb-1.5 p-0 text-[13px] font-bold text-ink-2">Secondary muscles, optional</legend>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={value.includes(m)}
            onClick={() => onToggle(m)}
            className={`min-h-9 rounded-full border px-3 text-[13px] font-bold ${
              value.includes(m) ? 'border-primary bg-primary-50 text-primary-ink' : 'border-line bg-surface text-ink-2'
            }`}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAll((a) => !a)}
          className="min-h-9 rounded-full px-3 text-[13px] font-bold text-primary-ink hover:bg-primary-50"
        >
          {all ? 'Fewer' : '+ More'}
        </button>
      </div>
    </fieldset>
  )
}
