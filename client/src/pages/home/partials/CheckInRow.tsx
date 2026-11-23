import { useSetEnergy } from '@/hooks/queries/useEnergy'
import { useSetRecovery } from '@/hooks/queries/useRecovery'
import { useSetWaist } from '@/hooks/queries/useWaist'
import { useSetWeight } from '@/hooks/queries/useWeight'
import type { DailyScore, DailyWaist, DailyWeight } from '@/services/HealthService/types/Health'
import type { Loadable } from '@/types/Loadable'
import type { DateKey } from '@/utils/date'
import { BatteryCharging, HeartPulse, Ruler, Scale, type LucideIcon } from 'lucide-react'
import { MetricTile } from './MetricTile'
import { row } from './ui'

type Props = {
  date: Date
  weight: Loadable<DailyWeight | null>
  /** Last weigh-in before this day, shown muted under the tile. */
  previousWeight: Loadable<DailyWeight | null>
  waist: Loadable<DailyWaist | null>
  previousWaist: Loadable<DailyWaist | null>
  energy: Loadable<DailyScore | null>
  recovery: Loadable<DailyScore | null>
}

// "Previous 72.4 kg · 16 Nov"; undefined when there's no earlier record.
const previous = (row: { date: DateKey } | null | undefined, value: string) =>
  row
    ? `Previous ${value} · ${new Date(`${row.date}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : undefined

// Body (weight, waist) and how the day felt (energy, recovery). null data → the tile's "Not recorded" state.
export const CheckInRow = ({ date, weight, previousWeight, waist, previousWaist, energy, recovery }: Props) => {
  const prevKg = previousWeight.data
  const prevCm = previousWaist.data

  const setWeight = useSetWeight(date)
  const setWaist = useSetWaist(date)
  const setEnergy = useSetEnergy(date)
  const setRecovery = useSetRecovery(date)

  return (
    <div className={`${row} lg:grid-cols-4 lg:gap-3`}>
      <MetricTile
        loading={weight.isPending}
        area="[grid-area:weight]"
        label="Weight"
        icon={Scale}
        value={weight.data ? `${weight.data.kg} kg` : null}
        detail={previous(prevKg, `${prevKg?.kg} kg`)}
        addLabel="Add"
        edit={{
          title: 'Edit weight',
          rows: [[{ name: 'kg', label: 'Weight', unit: 'kg', min: 20, max: 400, step: 0.1 }]],
          initial: weight.data ? { kg: String(weight.data.kg) } : undefined,
          saving: setWeight.isPending,
          save: (v) => setWeight.mutateAsync(v.kg),
        }}
      />
      <MetricTile
        loading={waist.isPending}
        area="[grid-area:waist]"
        label="Waist"
        icon={Ruler}
        value={waist.data ? `${waist.data.cm} cm` : null}
        detail={previous(prevCm, `${prevCm?.cm} cm`)}
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
