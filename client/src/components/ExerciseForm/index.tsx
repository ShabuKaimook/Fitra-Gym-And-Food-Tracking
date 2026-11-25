import { inputBase } from '@/components/Form'
import { useExerciseOptions } from '@/hooks/queries/useGym'
import type { Exercise, ExerciseOptions } from '@/services/WorkoutService/types/Workout'
import type { ReactNode } from 'react'
import { useExerciseForm } from './hooks/useExerciseForm'
import { ExercisePreview } from './partials/ExercisePreview'
import { OptionSelect } from './partials/OptionSelect'
import { PhotoField } from './partials/PhotoField'
import { SecondaryMuscles } from './partials/SecondaryMuscles'

type Props = {
  /** The form's id, for a Save button in the header that sits outside it. */
  formId: string
  /** The page's or sheet's own header; gets whether it's saving. */
  header: (saving: boolean) => ReactNode
  onSaved: (exercise: Exercise) => void
}

// White fields on the grey page; inputBase's own grey is swapped out, not overridden (CSS order would win).
const field = inputBase.replace('bg-surface-2', 'bg-surface')

// New custom exercise (wireframe 1n): photo, name, muscles, equipment, and what a set records.
// Desktop adds a live preview beside it. Used by its own page and by the split builder's sheet.
export const ExerciseForm = (props: Props) => {
  const { data: options } = useExerciseOptions()
  // The form starts on the first option of each list, so it waits for them.
  if (!options) return <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">{props.header(false)}</div>
  return <LoadedForm {...props} options={options} />
}

const LoadedForm = ({ formId, header, onSaved, options }: Props & { options: ExerciseOptions }) => {
  const f = useExerciseForm(options, onSaved)
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      {header(f.saving)}

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_22rem]">
        <form
          id={formId}
          className="flex min-w-0 flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            // Its own form may sit inside another page's form (the split builder); keep the submit here.
            e.stopPropagation()
            f.save()
          }}
        >
          <div className="flex items-end gap-3">
            <PhotoField photo={f.photo} onPick={f.setPhoto} />
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-bold text-ink-2">Name</span>
              <input
                className={`${field} text-base font-bold`}
                required
                // Spaces only would pass `required` but save an empty name.
                pattern=".*\S.*"
                maxLength={60}
                placeholder="Hammer strength row"
                value={f.name}
                onChange={(e) => f.setName(e.target.value)}
              />
            </label>
          </div>

          <OptionSelect label="Primary muscle" value={f.muscle} options={options.muscles} onChange={f.setMuscle} />
          <SecondaryMuscles options={options.secondaryMuscles} value={f.secondary} onToggle={f.toggleSecondary} />
          <OptionSelect label="Equipment" value={f.equipment} options={options.equipment} onChange={f.setEquipment} />
          <OptionSelect label="What you record" value={f.record} options={options.recordTypes} onChange={f.setRecord} />
          {f.record === 'weight-reps' && (
            <OptionSelect
              label="Weight unit"
              value={f.weightUnit}
              options={options.weightUnits}
              onChange={f.setWeightUnit}
              hint="Choose kg or lb for free weights. Machines without numbers log a pin level."
            />
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-ink-2">How to do it, optional</span>
            <textarea
              className={`${field} min-h-24 resize-y py-2.5 text-[15px] leading-5.5`}
              maxLength={500}
              placeholder="Chest on the pad, pull the handles to your ribs, pause one second."
              value={f.howTo}
              onChange={(e) => f.setHowTo(e.target.value)}
            />
          </label>
        </form>

        <ExercisePreview
          name={f.name}
          muscle={f.muscle}
          equipment={f.equipment}
          record={f.record}
          weightUnit={f.weightUnit}
          weightUnitLabel={options.weightUnits.find((u) => u.value === f.weightUnit)?.label ?? f.weightUnit}
          photo={f.photo}
        />
      </div>
    </div>
  )
}
