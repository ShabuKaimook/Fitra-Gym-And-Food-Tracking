// Pulsing grey placeholder while data loads. Give it the size and shape of what it stands in for
// (e.g. "min-h-28 rounded-[20px]"). Hidden from screen readers.
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-line/60 ${className}`} aria-hidden />
)
