import { Button } from '@/components/Button'
import { useRouteError } from 'react-router-dom'

// Shown when a route throws. The usual cause is a page chunk that no longer exists (new deploy or
// dev server restart while the app was open); a reload fetches the current files.
export const RouteError = () => {
  console.error(useRouteError())
  return (
    <div className="grid min-h-dvh place-content-center justify-items-center gap-3 p-4 text-center">
      <h1 className="m-0 text-2xl font-extrabold">Something went wrong</h1>
      <p className="m-0 text-ink-2">This page couldn't load. Reloading usually fixes it.</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  )
}
