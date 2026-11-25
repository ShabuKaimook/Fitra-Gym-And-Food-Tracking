import { EditorHeader } from '@/components/EditorHeader'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useExercises } from '@/hooks/queries/useGym'
import { dayLabel } from '@/pages/split/split'
import type { Split } from '@/services/WorkoutService/types/Workout'
import { WEEKDAYS } from '@/utils/date'
import { useMemo, useState } from 'react'
import { useSplitForm } from './hooks/useSplitForm'
import { DayEditor } from './partials/DayEditor'
import { ExercisePicker } from './partials/ExercisePicker'
import { NewExerciseSheet } from './partials/NewExerciseSheet'
import { PickerSheet } from './partials/PickerSheet'
import { SplitNameField } from './partials/SplitNameField'
import { UpdatePlansDialog } from './partials/UpdatePlansDialog'
import { WeekRow } from './partials/WeekRow'

const FORM_ID = 'split-form'

// The split builder (wireframe 1f): name it, pick the training days, then give each day a name and
// exercises. Mobile: the exercise picker opens as a sheet. Desktop: it's docked beside the day.
// No `split`: a new one. One of the user's own: edit it. Built-in: start a copy (the built-in stays).
// Layout only; the state and saving live in useSplitForm.
export const SplitForm = ({ split }: { split?: Split }) => {
  const f = useSplitForm(split)
  const exercises = useExercises()
  const byId = useMemo(() => new Map(exercises.data?.map((e) => [e.id, e])), [exercises.data])
  const [picking, setPicking] = useState(false)
  const [creating, setCreating] = useState(false)

  const title = f.mode === 'new' ? 'New split' : f.mode === 'copy' ? `Copy of ${split!.name}` : 'Edit split'
  const label = dayLabel(f.days, f.selected)
  const picker = {
    target: `${WEEKDAYS[f.selected]}, ${label}`,
    exercises: exercises.data,
    inDay: f.day.exerciseIds,
    onAdd: f.addExercises,
    onCustom: () => setCreating(true),
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <EditorHeader
        title={title}
        crumb="Gym /"
        backTo={ROUTE_PATHS.GYM}
        formId={FORM_ID}
        saving={f.saving}
        saveLabel="Save split"
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_24rem]">
        {/* The picker sits outside the form, so Enter in its search box can't save the split. */}
        <form
          id={FORM_ID}
          className="flex min-w-0 flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            f.save()
          }}
        >
          <SplitNameField value={f.name} onChange={f.setName} copyOf={f.mode === 'copy' ? split!.name : undefined} />
          <WeekRow days={f.days} onToggle={f.toggleDay} />
          <DayEditor
            days={f.days}
            selected={f.selected}
            onSelect={f.setSelected}
            label={label}
            exercises={byId}
            onRename={f.renameDay}
            onRemove={f.removeExercise}
            onAddExercises={() => setPicking(true)}
            onCopy={f.copyDay}
          />
        </form>

        <aside className="sticky top-20 flex h-[calc(100dvh-9.5rem)] flex-col rounded-[20px] border border-line/80 bg-surface-2 p-3.5 max-lg:hidden">
          {/* key: a fresh picker (no ticks left over) for each day. */}
          <ExercisePicker key={f.selected} {...picker} />
        </aside>
      </div>

      {picking && <PickerSheet {...picker} onClose={() => setPicking(false)} />}
      {creating && (
        <NewExerciseSheet
          target={picker.target}
          // A new exercise goes straight into the day it was made for.
          onCreated={(exercise) => f.addExercises([exercise.id])}
          onClose={() => setCreating(false)}
        />
      )}
      {f.askingPlans && (
        <UpdatePlansDialog
          splitName={f.name.trim()}
          plans={f.plans}
          saving={f.saving}
          onSave={f.saveEdit}
          onClose={f.closePlans}
        />
      )}
    </div>
  )
}
