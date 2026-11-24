export const ROUTE_PATHS = {
  ROOT: '/',
  HOME: '/home',
  GYM: '/gym',
  SPLIT_NEW: '/gym/splits/new',
  SPLIT_EDIT: '/gym/splits/:id/edit',
  FOOD: '/food',
  FOOD_LOG: '/food/log',
  FOOD_NEW: '/food/new',
  FOOD_EDIT: '/food/edit',
  ACTIVITY: '/activity',
  RECOVERY: '/recovery',
  BODY: '/body',
  ANALYSIS: '/analysis',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const

export const splitEditPath = (id: string) => ROUTE_PATHS.SPLIT_EDIT.replace(':id', encodeURIComponent(id))

export const MAIN_ROUTE_ID = 'main'
