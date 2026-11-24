import { Skeleton } from '@/components/Skeleton'
import { TopBarTitle } from '@/components/TopBarTitle'
import { useActivePlan, useLastSession, useSplits, useTemplates } from '@/hooks/queries/useGym'
import { usePlannedWorkout } from '@/hooks/queries/usePlannedWorkout'
import { muted } from '@/pages/home/partials/ui'
import { startOfToday } from '@/utils/date'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Link } from 'react-router-dom'
import { History, Plus } from 'lucide-react'
import { GymLinks } from './partials/GymLinks'
import { PlanCard } from './partials/PlanCard'
import { SplitsRail } from './partials/SplitsRail'
import { TodayPlanCard } from './partials/TodayPlanCard'
import { outlineBtn, primaryBtn, whiteBtn } from './partials/ui'

// Gym overview (wireframe 1e): today's workout, the active plan, splits, then templates and the library.
// shortcut: the buttons here (start workout, edit plan, templates…) do nothing yet; wire each to its
// screen (1f, 1m, 1g) as those are built.
const GymPage = () => {
  const today = startOfToday()
  const workout = usePlannedWorkout(today)
  const plan = useActivePlan()
  const splits = useSplits()
  const templates = useTemplates()
  const lastSession = useLastSession(today)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <TopBarTitle>
        <h1 className="m-0 text-xl font-extrabold tracking-[-0.4px]">Gym</h1>
      </TopBarTitle>

      <header className="flex items-center gap-2">
        <h1 className="m-0 text-2xl leading-7.5 font-extrabold tracking-[-0.4px] lg:hidden">Gym</h1>
        <button type="button" className={`${outlineBtn} ml-auto lg:hidden`}>
          <History size={14} aria-hidden />
          History
        </button>
        <div className="ml-auto flex gap-2 max-lg:hidden">
          <Link to={ROUTE_PATHS.SPLIT_NEW} className={whiteBtn}>
            <Plus size={15} aria-hidden />
            Create split
          </Link>
          <button type="button" className={primaryBtn}>
            <Plus size={15} aria-hidden />
            Create plan
          </button>
        </div>
      </header>

      {workout.isPending ? (
        <Skeleton className="h-44 rounded-[28px] lg:h-56" />
      ) : (
        <TodayPlanCard workout={workout.data ?? null} />
      )}
      {plan.isPending ? <Skeleton className="h-28 rounded-[20px] lg:h-16" /> : <PlanCard plan={plan.data ?? null} />}

      <section aria-labelledby="splits-title" className="flex flex-col gap-2.5">
        <div className="flex items-baseline gap-2">
          <h2 id="splits-title" className="m-0 text-[15px] font-extrabold">
            My splits
          </h2>
          {splits.data && (
            <span className={muted}>
              {splits.data.length}
              <span className="max-lg:hidden"> saved</span>
            </span>
          )}
          <Link
            to={ROUTE_PATHS.SPLIT_NEW}
            className="ml-auto inline-flex min-h-9 items-center text-[13px] font-bold text-primary-ink lg:hidden"
          >
            + New split
          </Link>
        </div>
        {splits.isPending ? (
          <Skeleton className="h-24 rounded-[18px] lg:h-26" />
        ) : (
          <SplitsRail splits={splits.data ?? []} />
        )}
      </section>

      <GymLinks templates={templates.data?.length} lastSession={lastSession.data} />
    </div>
  )
}

export default GymPage
