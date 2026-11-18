type Props = { value: number; max: number; color: string; className?: string }

// Decorative: the numbers next to it carry the meaning for screen readers.
export const ProgressBar = ({ value, max, color, className = '' }: Props) => (
  <div className={`h-2 min-w-7.5 overflow-hidden rounded-full bg-canvas ${className}`} aria-hidden>
    <i
      className="block h-full rounded-full"
      style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }}
    />
  </div>
)
