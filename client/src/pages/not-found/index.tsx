import { NotFound } from '@/components/NotFound'
import { ROUTE_PATHS } from '@/constants/routePaths'

const NotFoundPage = () => (
  <NotFound
    title="Page not found"
    description="This page doesn't exist yet."
    backTo={ROUTE_PATHS.HOME}
    backLabel="Back to Home"
  />
)

export default NotFoundPage
