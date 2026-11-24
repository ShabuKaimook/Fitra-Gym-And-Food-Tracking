import { Skeleton } from '@/components/Skeleton'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useSplit } from '@/hooks/queries/useGym'
import { SplitForm } from '../partials/SplitForm'
import { Link, useParams } from 'react-router-dom'

// Edit a split (/gym/splits/:id/edit): the new split builder, filled in. Built-in splits open as a copy.
const SplitEditPage = () => {
  const { id = '' } = useParams()
  const split = useSplit(id)

  // key: the form copies the split into its state once, so a different split needs a fresh form.
  if (split.data) return <SplitForm key={split.data.id} split={split.data} />
  if (split.isPending) return <Skeleton className="mx-auto h-112 w-full max-w-5xl rounded-[28px]" />
  return (
    <div className="flex flex-col items-start gap-2 rounded-[20px] border border-line/80 bg-surface p-4">
      <p className="m-0 font-bold">Split not found</p>
      <Link to={ROUTE_PATHS.GYM} className="font-bold text-primary-ink">
        Back to Gym
      </Link>
    </div>
  )
}

export default SplitEditPage
