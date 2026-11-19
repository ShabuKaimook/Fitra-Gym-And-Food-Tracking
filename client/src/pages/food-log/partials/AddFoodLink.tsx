import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

// "+ Add food": opens the New food form.
export const AddFoodLink = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="inline-flex h-8 flex-none items-center gap-1.5 rounded-full bg-primary px-3 text-[13px] font-bold text-on-primary"
  >
    <Plus size={15} aria-hidden />
    Add food
  </Link>
)
