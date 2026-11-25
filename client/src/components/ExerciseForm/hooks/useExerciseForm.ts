import { useCreateExercise } from '@/hooks/queries/useGym'
import type {
  Equipment,
  Exercise,
  ExerciseOptions,
  Muscle,
  RecordType,
  SecondaryMuscle,
  WeightUnit,
} from '@/services/WorkoutService/types/Workout'
import { useState } from 'react'
import { toast } from 'react-toastify'

// State and saving for the new exercise form (1n). onSaved gets the saved exercise (the page goes back,
// the split builder adds it to the day). Starts on the first of each list of options.
export const useExerciseForm = (options: ExerciseOptions, onSaved: (exercise: Exercise) => void) => {
  const createExercise = useCreateExercise()
  const [name, setName] = useState('')
  const [muscle, setMuscle] = useState<Muscle>(options.muscles[0])
  const [secondary, setSecondary] = useState<SecondaryMuscle[]>([])
  const [equipment, setEquipment] = useState<Equipment>(options.equipment[0])
  const [record, setRecord] = useState<RecordType>(options.recordTypes[0].value)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(options.weightUnits[0].value)
  const [howTo, setHowTo] = useState('')
  const [photo, setPhoto] = useState<string>()

  const toggleSecondary = (m: SecondaryMuscle) =>
    setSecondary((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]))

  const save = () =>
    createExercise.mutate(
      {
        name: name.trim(),
        muscle,
        secondary,
        equipment,
        record,
        // A unit only means something when sets record weight.
        weightUnit: record === 'weight-reps' ? weightUnit : null,
        howTo: howTo.trim(),
        photo,
      },
      {
        onSuccess: (exercise) => {
          toast.success(`Saved ${exercise.name}`)
          onSaved(exercise)
        },
        onError: () => toast.error('Exercise not saved, try again'),
      },
    )

  return {
    name,
    setName,
    muscle,
    setMuscle,
    secondary,
    toggleSecondary,
    equipment,
    setEquipment,
    record,
    setRecord,
    weightUnit,
    setWeightUnit,
    howTo,
    setHowTo,
    photo,
    setPhoto,
    save,
    saving: createExercise.isPending,
  }
}
