import { AppLayout } from '@/components/Layouts/AppLayout'
import { RouteError } from '@/components/RouteError'
import { MAIN_ROUTE_ID, ROUTE_PATHS } from '@/constants/routePaths'
import type { RouteHandle } from '@/hooks/useFullScreen'
import type { ComponentType } from 'react'
import type { NonIndexRouteObject, RouteObject } from 'react-router-dom'
import { createBrowserRouter, Navigate } from 'react-router-dom'

type PageLoader = () => Promise<{ default: ComponentType }>

// Each page is its own chunk; the route id is its path so the nav can highlight it.
const page = (path: string, load: PageLoader, handle?: RouteHandle): NonIndexRouteObject => ({
  id: path,
  path,
  handle,
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
    errorElement: <RouteError />,
    HydrateFallback: () => null,
    children: [
      redirect(ROUTE_PATHS.ROOT, ROUTE_PATHS.HOME),
      page(ROUTE_PATHS.HOME, () => import('@/pages/home')),
      page(ROUTE_PATHS.FOOD_LOG, () => import('@/pages/food-log')),
      page(ROUTE_PATHS.FOOD_NEW, () => import('@/pages/food-new'), { fullScreen: true }),
      page(ROUTE_PATHS.FOOD_EDIT, () => import('@/pages/food-edit'), { fullScreen: true }),
      page(ROUTE_PATHS.NOT_FOUND, () => import('@/pages/not-found')),
    ],
  },
])
