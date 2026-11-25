import { Dumbbell } from 'lucide-react'

// An exercise's small square picture: its photo, or a grey dumbbell placeholder.
// shortcut: built-in exercises have no photos yet (1f note); they get one when the library does.
export const ExerciseThumb = ({ src }: { src?: string }) =>
  src ? (
    <img src={src} alt="" className="size-10 flex-none rounded-xl object-cover" />
  ) : (
    <span className="grid size-10 flex-none place-items-center rounded-xl bg-surface-2 text-ink-3" aria-hidden>
      <Dumbbell size={16} />
    </span>
  )
