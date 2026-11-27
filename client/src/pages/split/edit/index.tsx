import { NotFound } from '@/components/NotFound'
import { Skeleton } from '@/components/Skeleton'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useSplit } from '@/hooks/queries/useGym'
import { SplitForm } from '../partials/SplitForm'
import { useParams } from 'react-router-dom'

// Edit a split (/gym/splits/:id/edit): the new split builder, filled in. Built-in splits open as a copy.
const SplitEditPage = () => {
  const { id = '' } = useParams()
  const split = useSplit(id)

  // key: the form copies the split into its state once, so a different split needs a fresh form.
  if (split.data) return <SplitForm key={split.data.id} split={split.data} />
  if (split.isPending) return <Skeleton className="mx-auto h-112 w-full max-w-5xl rounded-[28px]" />
  return (
    <NotFound
      title="Split not found"
      description="It may have been deleted, or the link is wrong."
      backTo={ROUTE_PATHS.GYM}
      backLabel="Back to Gym"
    />
  )
}

export default SplitEditPage
