import { ROUTE_PATHS } from '@/constants/routePaths'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="grid justify-items-start gap-2">
    <h1 className="text-2xl font-extrabold">Page not found</h1>
    <p className="text-ink-2">This page doesn't exist yet.</p>
    <Link to={ROUTE_PATHS.HOME} className="font-bold text-primary-ink">
      Back to Home
    </Link>
  </div>
)

export default NotFoundPage
