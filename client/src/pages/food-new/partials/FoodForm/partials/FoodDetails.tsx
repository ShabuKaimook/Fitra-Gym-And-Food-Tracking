import type { Food } from '@/services/FoodService/types/Food'
import { PillInput } from './PillField'
import { TitleField } from './TitleField'
import { UnitRow } from './UnitRow'

type Change = { target: { value: string } }

type Props = {
  name: string
  per: string
  unit: Food['unit']
  onName: (e: Change) => void
  onPer: (e: Change) => void
  onUnit: (unit: Food['unit']) => void
}

// What the food is: its name, and the amount + unit its nutrients are for.
export const FoodDetails = ({ name, per, unit, onName, onPer, onUnit }: Props) => (
  <>
    <TitleField
      label="Food name"
      required
      // Spaces only would pass `required` but save an empty name.
      pattern=".*\S.*"
      maxLength={100}
      value={name}
      onChange={onName}
    />
    <PillInput label="Nutrition per" inputMode="decimal" required min={0.1} max={10000} value={per} onChange={onPer} />
    <UnitRow value={unit} onChange={onUnit} />
  </>
)
