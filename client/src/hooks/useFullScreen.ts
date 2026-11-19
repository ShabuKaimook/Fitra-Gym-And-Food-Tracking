import { useMatches } from 'react-router-dom'

/** Set on a route as `handle` (see router). */
export type RouteHandle = { fullScreen?: boolean }

// True on routes marked fullScreen: on mobile they hide the bottom nav (e.g. the New food editor).
export const useFullScreen = () => useMatches().some((m) => (m.handle as RouteHandle | undefined)?.fullScreen)
