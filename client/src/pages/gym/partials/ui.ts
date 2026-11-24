import { btnBase } from '@/pages/home/partials/ui'

// Buttons shared by the Gym cards (cards themselves reuse Home's `card` classes).
export const primaryBtn = `${btnBase} min-h-11 rounded-2xl bg-primary px-4 text-sm text-on-primary hover:bg-primary-hover`
// Same size as primaryBtn, white with orange text: the secondary action beside it.
export const whiteBtn = `${btnBase} min-h-11 rounded-2xl border border-line bg-surface px-4 text-sm text-primary hover:bg-primary-50`
export const softBtn = `${btnBase} min-h-10 rounded-xl bg-primary-50 px-3.5 text-sm text-primary-ink hover:bg-primary-100`
export const outlineBtn = `${btnBase} min-h-9 rounded-xl border border-line bg-surface px-3 text-[13px] hover:bg-surface-2`
// Small label pill: "Active plan", "Custom", "Built-in".
export const tag = 'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-bold'
