import { ExerciseThumb } from '@/components/ExerciseThumb'
import { ListItem } from '@/components/ListItem'
import { Card } from '@/components/Card'
import { ToggleChip } from '@/components/ToggleChip'
import { Button } from '@/components/Button'
import { SearchInput } from '@/components/SearchInput'
import { useExerciseOptions } from '@/hooks/queries/useGym'
import type { Equipment, Exercise, Muscle } from '@/services/WorkoutService/types/Workout'
import { Plus, Star } from 'lucide-react'
import { useState, type ReactNode } from 'react'

type Props = {
  /** "Mon, Upper" */
  target: string
  exercises: Exercise[] | undefined
  /** Already in the day: tagged "In day" and can't be picked again. */
  inDay: string[]
  onAdd: (ids: string[]) => void
  /** Opens the new exercise form (1n). */
  onCustom: () => void
  /** Mobile sheet: the close button. */
  header?: ReactNode
}

// Search and filter the library, tick exercises, add them to one day (1f). Muscles or equipment:
// any ticked chip in a row matches; the rows and Favourites narrow each other.
export const ExercisePicker = ({ target, exercises = [], inDay, onAdd, onCustom, header }: Props) => {
  const { data: options } = useExerciseOptions()
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
        <Button variant="soft" size="sm" onClick={onCustom}>
          <Plus size={14} aria-hidden />
          Custom
        </Button>
      </div>

      <SearchInput label="Search exercises" value={query} onChange={setQuery} />

      <div role="group" aria-label="Muscle" className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
        <ToggleChip on={favourites} onClick={() => setFavourites((f) => !f)}>
          <Star size={13} aria-hidden />
          Favourites
        </ToggleChip>
        {options?.muscles.map((m) => (
          <ToggleChip key={m} on={muscles.includes(m)} onClick={() => setMuscles((ms) => toggle(ms, m))}>
            {m}
          </ToggleChip>
        ))}
      </div>
      <div role="group" aria-label="Equipment" className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
        {options?.equipment.map((e) => (
          <ToggleChip key={e} on={equipment.includes(e)} onClick={() => setEquipment((es) => toggle(es, e))}>
            {e}
          </ToggleChip>
        ))}
      </div>

      {/* data-scroll-area: the one place that scrolls while the mobile sheet locks the page. */}
      <Card
        as="ul"
        data-scroll-area
        className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain px-3.5 py-1"
      >
        {shown.length === 0 && <li className="py-4 text-center text-[13px] text-ink-2">No exercises match</li>}
        {shown.map((e) => {
          const already = inDay.includes(e.id)
          return (
            <li key={e.id} className="border-b border-line-soft last:border-b-0">
              <ListItem
                as="label"
                start={<ExerciseThumb src={e.photo} />}
                title={e.name}
                subtitle={`${e.muscle}, ${e.equipment.toLowerCase()}`}
                className={already ? 'opacity-60' : 'cursor-pointer'}
                badge={
                  already && (
                    <span className="flex-none rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-ink-2">
                      In day
                    </span>
                  )
                }
                end={
                  <input
                    type="checkbox"
                    className="size-5 flex-none accent-primary"
                    disabled={already}
                    checked={already || picked.includes(e.id)}
                    onChange={() => setPicked((p) => toggle(p, e.id))}
                  />
                }
              />
            </li>
          )
        })}
      </Card>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-ink-2 tabular-nums" aria-live="polite">
          {picked.length} selected
        </span>
        <Button disabled={picked.length === 0} onClick={add} className="ml-auto">
          Add {picked.length || ''} to {target.split(',')[0]}
        </Button>
      </div>
    </div>
  )
}
