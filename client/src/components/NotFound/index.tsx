import { Button } from '@/components/Button'
import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  /** "Split not found" */
  title: string
  /** Optional line under the title. */
  description?: ReactNode
  /** Where the button goes, and what it says: "Back to Gym". */
  backTo: string
  backLabel: string
  /** Picture above the title, e.g. your own <svg> or <img>. Default: a magnifier with a cross. */
  icon?: ReactNode
}

// Shown in the middle of the page when what it should open doesn't exist (bad link, deleted, no such page).
export const NotFound = ({ title, description, backTo, backLabel, icon }: Props) => (
  <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 px-4 text-center">
    {icon ?? (
      <span className="grid size-16 place-items-center rounded-full bg-primary-50 text-primary" aria-hidden>
        <SearchX size={28} />
      </span>
    )}
    <div className="flex flex-col gap-1">
      <h1 className="m-0 text-xl font-extrabold tracking-[-0.4px]">{title}</h1>
      {description && <p className="m-0 text-sm text-ink-2">{description}</p>}
    </div>
    <Button variant="outline" to={backTo} className="mt-1">
      {backLabel}
    </Button>
  </div>
)
