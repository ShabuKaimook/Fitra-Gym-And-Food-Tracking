import { Card } from '@/components/Card'
import { ExerciseThumb } from '@/components/ExerciseThumb'
import type { Equipment, Muscle, RecordType, WeightUnit } from '@/services/WorkoutService/types/Workout'

type Props = {
  name: string
  muscle: Muscle
  equipment: Equipment
  record: RecordType
  weightUnit: WeightUnit
  /** "Kilograms (kg)" */
  weightUnitLabel: string
  photo: string | undefined
}

// Example numbers for the sample set, so the columns read as they would in a workout.
const SAMPLE = { kg: '40', lb: '90', level: '7', reps: '10', time: '0:45' }
const COLUMN = { kg: 'kg', lb: 'lb', level: 'Level', reps: 'Reps', time: 'Time' }

// Desktop: how the exercise will look in the picker and in a workout, updating as the form changes.
export const ExercisePreview = ({ name, muscle, equipment, record, weightUnit, weightUnitLabel, photo }: Props) => {
  const title = name.trim() || 'Exercise name'
  const columns = record === 'weight-reps' ? [weightUnit, 'reps' as const] : [record]
  return (
    <Card as="aside" tone="muted" aria-label="Preview" className="sticky top-20 flex flex-col gap-3 max-lg:hidden">
      <h2 className="m-0 text-[13px] font-bold text-ink-2">Preview</h2>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink-2">In the picker</span>
        <div className="flex items-center gap-3 rounded-[16px] border border-line/80 bg-surface px-3 py-2.5">
          <ExerciseThumb src={photo} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-extrabold">{title}</span>
            <span className="text-xs text-ink-2">
              {muscle}, {equipment.toLowerCase()}
            </span>
          </span>
          <span className="size-5 flex-none rounded border border-ink-3" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink-2">In a workout</span>
        <div className="flex flex-col gap-2 rounded-[16px] border border-line/80 bg-surface px-3 py-2.5">
          <div>
            <div className="truncate text-[13px] font-extrabold">{title}</div>
            {record === 'weight-reps' && (
              <div className="text-xs text-ink-2">Weight unit: {weightUnitLabel.toLowerCase()}</div>
            )}
          </div>
          <table className="w-full border-collapse text-xs tabular-nums">
            <thead>
              <tr className="text-left text-ink-2">
                <th className="py-1 font-semibold">Set</th>
                <th className="py-1 font-semibold">Previous</th>
                {columns.map((c) => (
                  <th key={c} className="py-1 font-semibold">
                    {COLUMN[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 font-bold">1</td>
                <td className="py-1 text-ink-3">none yet</td>
                {columns.map((c) => (
                  <td key={c} className="py-1 font-bold">
                    {SAMPLE[c]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
