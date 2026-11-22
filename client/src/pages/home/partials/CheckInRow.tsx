import { Skeleton } from '@/components/Skeleton'
import { useSetEnergy } from '@/hooks/queries/useEnergy'
import { useSetNote } from '@/hooks/queries/useNote'
import { useSetRecovery } from '@/hooks/queries/useRecovery'
import { useSetWaist } from '@/hooks/queries/useWaist'
import type { DailyNote, DailyScore, DailyWaist } from '@/services/HealthService/types/Health'
import type { Loadable } from '@/types/Loadable'
import { toDateKey } from '@/utils/date'
import { BatteryCharging, HeartPulse, Ruler, type LucideIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import { MetricTile } from './MetricTile'
import { NoteCard } from './NoteCard'
import { cardSkeleton, row } from './ui'

type Props = {
  date: Date
  waist: Loadable<DailyWaist | null>
  energy: Loadable<DailyScore | null>
  recovery: Loadable<DailyScore | null>
  note: Loadable<DailyNote | null>
}

// Waist, energy and recovery tiles, then the day's note. null data → the tile's "Not recorded" state.
export const CheckInRow = ({ date, waist, energy, recovery, note }: Props) => {
  const setWaist = useSetWaist(date)
  const setEnergy = useSetEnergy(date)
  const setRecovery = useSetRecovery(date)
  const setNote = useSetNote(date)

  return (
    <div className={`${row} lg:grid-cols-3`}>
      <MetricTile
        loading={waist.isPending}
        area="[grid-area:waist]"
        label="Waist"
        icon={Ruler}
        value={waist.data ? `${waist.data.cm} cm` : null}
        addLabel="Add"
        edit={{
          title: 'Edit waist',
          rows: [[{ name: 'cm', label: 'Waist', unit: 'cm', min: 30, max: 250, step: 0.1 }]],
          initial: waist.data ? { cm: String(waist.data.cm) } : undefined,
          saving: setWaist.isPending,
          save: (v) => setWaist.mutateAsync(v.cm),
        }}
      />
      <ScoreTile
        label="Energy"
        icon={BatteryCharging}
        tone="activity"
        area="[grid-area:energy]"
        score={energy}
        saving={setEnergy.isPending}
        save={setEnergy.mutateAsync}
      />
      <ScoreTile
        label="Recovery"
        icon={HeartPulse}
        tone="sleep"
        area="[grid-area:recovery]"
        score={recovery}
        saving={setRecovery.isPending}
        save={setRecovery.mutateAsync}
      />

      {note.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-32 [grid-area:note] lg:col-span-3`} />
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

type ScoreTileProps = {
  label: string
  icon: LucideIcon
  tone: 'activity' | 'sleep'
  area: string
  score: Loadable<DailyScore | null>
  saving: boolean
  save: (score: number) => Promise<unknown>
}

// A 1–10 rating of the day (energy, recovery): "7 / 10" with a bar, rated in a one-field dialog.
const ScoreTile = ({ label, icon, tone, area, score, saving, save }: ScoreTileProps) => {
  const value = score.data?.score ?? null
  return (
    <MetricTile
      loading={score.isPending}
      area={area}
      label={label}
      icon={icon}
      tone={tone}
      value={value === null ? null : String(value)}
      target="10"
      progress={value === null ? undefined : { value, max: 10 }}
      addLabel="Rate"
      edit={{
        title: `${label} score`,
        rows: [[{ name: 'score', label, unit: '/ 10', min: 1, max: 10 }]],
        initial: value === null ? undefined : { score: String(value) },
        saving,
        save: (v) => save(v.score),
      }}
    />
  )
}
