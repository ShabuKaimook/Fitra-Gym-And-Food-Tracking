// Class strings shared by the Home cards. Colours stay out of `card` so a card can pick its own
// (in Tailwind the stylesheet decides which of two conflicting classes wins, not className order).
export const card = 'flex min-w-0 flex-col gap-2 rounded-[20px] border p-3.5'
export const cardSurface = 'border-line/80 bg-surface'
export const cardLabel = 'm-0 flex items-center gap-1.5 text-[13px] font-bold text-ink-2 [&_svg]:text-ink-3'
export const muted = 'text-[13px] leading-4.5 text-ink-2 tabular-nums'
// A row of cards: dissolves into the page's 2-column grid on mobile, its own grid on desktop.
export const row = 'contents lg:grid lg:gap-3.5'
// Skeleton standing in for a card: same corners; desktop rows have no named grid areas, so reset it.
export const cardSkeleton = 'rounded-[20px] lg:[grid-area:auto]'
