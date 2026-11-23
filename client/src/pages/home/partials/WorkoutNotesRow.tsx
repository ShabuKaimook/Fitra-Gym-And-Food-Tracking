import { Skeleton } from '@/components/Skeleton'
import { useSetNote } from '@/hooks/queries/useNote'
import type { DailyNote } from '@/services/HealthService/types/Health'
import type { PlannedWorkout } from '@/services/WorkoutService/types/Workout'
import type { Loadable } from '@/types/Loadable'
import { toDateKey } from '@/utils/date'
import { toast } from 'react-toastify'
import { NoteCard } from './NoteCard'
import { WorkoutCard } from './WorkoutCard'
import { cardSkeleton, row } from './ui'

type Props = {
  date: Date
  isToday: boolean
  workout: Loadable<PlannedWorkout | null>
  note: Loadable<DailyNote | null>
}

// The day's plan and its note: planned workout (hidden on rest days) beside the note on desktop,
// same widths as the calories row above. With no workout the note takes the whole row.
export const WorkoutNotesRow = ({ date, isToday, workout, note }: Props) => {
  const setNote = useSetNote(date)

  return (
    <div className={`${row} lg:grid-cols-[1.25fr_1fr]`}>
      {workout.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-24 [grid-area:workout]`} />
      ) : (
        workout.data && <WorkoutCard workout={workout.data} isToday={isToday} />
      )}
      {note.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-32 [grid-area:note]`} />
      ) : (
        // key: the card copies the note into its text box once, so a new day needs a fresh card.
        <NoteCard
          key={toDateKey(date)}
          note={note.data?.text ?? ''}
          saving={setNote.isPending}
          onSave={(text) =>
            setNote.mutate(text, {
              onSuccess: () => toast.success('Note saved'),
              onError: () => toast.error('Note not saved, try again'),
            })
          }
        />
      )}
    </div>
  )
}
