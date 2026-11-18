import { AppLayout } from '@/components/Layouts/AppLayout'
import { MAIN_ROUTE_ID, ROUTE_PATHS } from '@/constants/routePaths'
import type { ComponentType } from 'react'
import type { NonIndexRouteObject, RouteObject } from 'react-router-dom'
import { createBrowserRouter, Navigate } from 'react-router-dom'

type PageLoader = () => Promise<{ default: ComponentType }>

// Each page is its own chunk; the route id is its path so the nav can highlight it.
const page = (path: string, load: PageLoader): NonIndexRouteObject => ({
  id: path,
  path,
  lazy: async () => ({ Component: (await load()).default }),
})

const redirect = (from: string, to: string): RouteObject => ({
  path: from,
  element: <Navigate to={to} replace />,
})

export const router = createBrowserRouter([
  {
    id: MAIN_ROUTE_ID,
    element: <AppLayout />,
    HydrateFallback: () => null,
    children: [
      redirect(ROUTE_PATHS.ROOT, ROUTE_PATHS.HOME),
      page(ROUTE_PATHS.HOME, () => import('@/pages/home')),
      page(ROUTE_PATHS.NOT_FOUND, () => import('@/pages/not-found')),
    ],
  },
])
