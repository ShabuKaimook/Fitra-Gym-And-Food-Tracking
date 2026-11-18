// Grey pulsing block shown while a card's query loads. Pass the mobile grid-area and a min-h-* height;
// desktop rows have no named areas, so lg resets it like the real cards do.
export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-[20px] bg-line/60 lg:[grid-area:auto] ${className}`} aria-hidden />
)
