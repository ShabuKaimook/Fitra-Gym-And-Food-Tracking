// The part of a TanStack Query result a view needs, so a component can take `query` as-is.
export type Loadable<T> = { isPending: boolean; data: T | undefined }
