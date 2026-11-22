import { FormPage } from '@/components/Form'
import { MealPicker } from '@/components/MealPicker'
import { PhotoCover } from '@/components/PhotoCover'
import type { Food } from '@/services/FoodService/types/Food'
import { useFoodForm } from './hooks/useFoodForm'
import { FoodDetails } from './partials/FoodDetails'
import { NutritionFields } from './partials/NutritionFields'

// The food card form (1j's third screen), blank for a new food or filled in to log and edit `food`.
// Layout only; the state and saving live in useFoodForm.
export const FoodForm = ({ food }: { food?: Food }) => {
  const f = useFoodForm(food)

  return (
    <FormPage
      title={food ? 'Edit food' : 'New food'}
      backTo={f.logUrl}
      submitLabel={f.submitLabel}
      onSubmit={f.save}
      pending={f.pending}
      headerCenter={<MealPicker value={f.meal} onChange={f.setMeal} className="bg-surface/70 backdrop-blur-sm" />}
      cover={<PhotoCover image={f.image} fallback="/illustrations/new-food.svg" onPick={f.setImage} />}
      side={
        <FoodDetails
          name={f.form.name}
          per={f.form.per}
          unit={f.form.unit}
          onName={f.setName}
          onPer={f.setPer}
          onUnit={f.setUnit}
        />
      }
    >
      <NutritionFields values={f.form} micros={f.micros} onMacro={f.setMacro} onMicros={f.changeMicros} />
    </FormPage>
  )
}
