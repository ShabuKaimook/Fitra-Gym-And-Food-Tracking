import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'

type Dated = { date: DateKey }

// 'YYYY-MM-DD' strings sort like dates, so plain string comparison works.
export const inRange = <T extends Dated>(rows: T[], from: DateKey, to: DateKey) =>
  rows.filter((r) => r.date >= from && r.date <= to)

export const onDate = <T extends Dated>(rows: T[], date: DateKey) => rows.find((r) => r.date === date) ?? null

// shortcut: stands in for AxiosUtil.createRequest until the API exists; services swap this one call.
// Resolves after a short delay (so loading states show) and honours the abort signal like Axios.
export const mockRequest = <T>(data: T, options?: RequestOptions) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => resolve(structuredClone(data)), 300)
    options?.signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(options.signal!.reason)
    })
  })
