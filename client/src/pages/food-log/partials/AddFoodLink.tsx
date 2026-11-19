import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

// "+ Add food": opens the New food form (used in the header and the "Not what you need?" card).
export const AddFoodLink = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="inline-flex h-9 flex-none items-center gap-1.5 rounded-xl bg-primary-50 px-3 text-[13px] font-bold text-primary-ink"
  >
    <Plus size={15} aria-hidden />
    Add food
  </Link>
)
