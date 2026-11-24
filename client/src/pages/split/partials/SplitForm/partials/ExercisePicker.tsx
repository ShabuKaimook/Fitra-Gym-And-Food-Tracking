import { inputBase } from '@/components/Form'
import type { Equipment, Exercise, Muscle } from '@/services/WorkoutService/types/Workout'
import { Plus, Search, Star } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { ExerciseThumb } from './ExerciseThumb'

const MUSCLES: Muscle[] = ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core']
const EQUIPMENT: Equipment[] = ['Machine', 'Dumbbell', 'Barbell', 'Cable', 'Bodyweight']

type Props = {
  /** "Mon, Upper" */
  target: string
  exercises: Exercise[] | undefined
  /** Already in the day: tagged "In day" and can't be picked again. */
  inDay: string[]
  onAdd: (ids: string[]) => void
  /** Mobile sheet: the close button. */
  header?: ReactNode
}

// Search and filter the library, tick exercises, add them to one day (1f). Muscles or equipment:
// any ticked chip in a row matches; the rows and Favourites narrow each other.
export const ExercisePicker = ({ target, exercises = [], inDay, onAdd, header }: Props) => {
  const [query, setQuery] = useState('')
  const [favourites, setFavourites] = useState(false)
  const [muscles, setMuscles] = useState<Muscle[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [picked, setPicked] = useState<string[]>([])

  const q = query.trim().toLowerCase()
  const shown = exercises.filter(
    (e) =>
      (!q || e.name.toLowerCase().includes(q)) &&
      (!favourites || e.favourite) &&
      (muscles.length === 0 || muscles.includes(e.muscle)) &&
      (equipment.length === 0 || equipment.includes(e.equipment)),
  )
  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  const add = () => {
    onAdd(picked)
    setPicked([])
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">
      <div className="flex items-start gap-2">
        {header}
        <div className="min-w-0 flex-1">
          <h2 className="m-0 truncate text-[15px] font-extrabold">Add to {target}</h2>
        </div>
        {/* shortcut: Custom exercise opens 1n once it's built. */}
        <button
          type="button"
          className="inline-flex min-h-9 flex-none items-center gap-1 rounded-xl bg-primary-50 px-3 text-[13px] font-extrabold text-primary-ink"
        >
          <Plus size={14} aria-hidden />
          Custom
        </button>
      </div>

      <label className="relative">
        <span className="sr-only">Search exercises</span>
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" aria-hidden />
        <input
          type="search"
          className={`${inputBase} min-h-10 pl-9 text-sm`}
          placeholder="Search exercises"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div role="group" aria-label="Muscle" className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
        <Chip on={favourites} onClick={() => setFavourites((f) => !f)}>
          <Star size={13} aria-hidden />
          Favourites
        </Chip>
        {MUSCLES.map((m) => (
          <Chip key={m} on={muscles.includes(m)} onClick={() => setMuscles((ms) => toggle(ms, m))}>
            {m}
          </Chip>
        ))}
      </div>
      <div role="group" aria-label="Equipment" className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
        {EQUIPMENT.map((e) => (
          <Chip key={e} on={equipment.includes(e)} onClick={() => setEquipment((es) => toggle(es, e))}>
            {e}
          </Chip>
        ))}
      </div>

      {/* data-scroll-area: the one place that scrolls while the mobile sheet locks the page. */}
      <ul
        data-scroll-area
        className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain rounded-[20px] border border-line/80 bg-surface px-3.5 py-1"
      >
        {shown.length === 0 && <li className="py-4 text-center text-[13px] text-ink-2">No exercises match</li>}
        {shown.map((e) => {
          const already = inDay.includes(e.id)
          return (
            <li key={e.id} className="border-b border-line-soft last:border-b-0">
              <label className={`flex items-center gap-3 py-2.5 ${already ? 'opacity-60' : 'cursor-pointer'}`}>
                <ExerciseThumb />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-1.5 text-[13px] font-extrabold">
                    <span className="truncate">{e.name}</span>
                    {already && (
                      <span className="flex-none rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-ink-2">
                        In day
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-ink-2">
                    {e.muscle}, {e.equipment.toLowerCase()}
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="size-5 flex-none accent-primary"
                  disabled={already}
                  checked={already || picked.includes(e.id)}
                  onChange={() => setPicked((p) => toggle(p, e.id))}
                />
              </label>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-ink-2 tabular-nums" aria-live="polite">
          {picked.length} selected
        </span>
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={add}
          className="ml-auto min-h-11 rounded-2xl bg-primary px-4 text-sm font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-50"
        >
          Add {picked.length || ''} to {target.split(',')[0]}
        </button>
      </div>
    </div>
  )
}

const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={`inline-flex min-h-9 flex-none items-center gap-1 rounded-full border px-3 text-[13px] font-bold ${
      on ? 'border-primary bg-primary-50 text-primary-ink' : 'border-line bg-surface text-ink-2'
    }`}
  >
    {children}
  </button>
)
