import { AddFoodLink } from './AddFoodLink'

// Dashed card under the results: "Not what you need?" → New food.
export const CreateFoodCard = ({ newFoodUrl }: { newFoodUrl: string }) => (
  <div className="flex items-center gap-3 rounded-[20px] border border-dashed border-ink-3 p-3.5">
    <div className="flex-1">
      <div className="text-sm font-bold">Not what you need?</div>
      <div className="text-xs text-ink-2">Create it once, reuse it any time</div>
    </div>
    <AddFoodLink to={newFoodUrl} />
  </div>
)
