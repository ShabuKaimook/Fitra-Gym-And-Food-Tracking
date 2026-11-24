import { Dumbbell } from 'lucide-react'

// shortcut: grey placeholder until exercises have photos (1f note); swap for the photo when they do.
export const ExerciseThumb = () => (
  <span className="grid size-10 flex-none place-items-center rounded-xl bg-surface-2 text-ink-3" aria-hidden>
    <Dumbbell size={16} />
  </span>
)
