import { UnitSelect } from '@/components/UnitSelect'
import { useUnits } from '@/hooks/queries/useUnits'
import type { UnitId } from '@/services/FoodService/types/Food'
import { useId } from 'react'
import { labelText, row } from './PillField'

type Props = { value: UnitId; onChange: (unit: UnitId) => void }

const GROUPS = [
  { kind: 'base', label: 'Weight & volume' },
  { kind: 'portion', label: 'Portions' },
] as const

// "Unit  [ Grams (g) ⌄ ]" row of the food card: what "Nutrition per" is counted in.
export const UnitRow = ({ value, onChange }: Props) => {
  const labelId = useId()
  const units = useUnits().data ?? []
  return (
    <div className={row}>
      <span id={labelId} className={labelText}>
        Unit
      </span>
      <UnitSelect
        value={value}
        onChange={onChange}
        aria-labelledby={labelId}
        align="end"
        className="min-h-11 w-auto rounded-full bg-surface pr-4 pl-5 font-semibold"
        groups={GROUPS.map(({ kind, label }) => ({
          label,
          options: units.filter((u) => u.kind === kind).map((u) => ({ value: u.id, label: u.label })),
        }))}
      />
    </div>
  )
}
