import type { ReactNode } from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'

type Props = {
  value: number
  max: number
  /** Fill and unfilled track, e.g. 'var(--color-primary)'. */
  color: string
  trackColor: string
  /** Stroke width as a share of the radius (0–1). */
  thickness?: number
  /** Accessible description, e.g. "960 of 2,200 kcal eaten". Without it the ring is decorative. */
  label?: string
  /** Size the ring here (e.g. "size-28"); it fills this box. */
  className?: string
  /** Shown centred inside the ring. */
  children?: ReactNode
}

// Circular progress meter (Recharts radial bar): fills clockwise from 12 o'clock, capped at 100%.
export const ProgressRing = ({
  value,
  max,
  color,
  trackColor,
  thickness = 0.2,
  label,
  className = '',
  children,
}: Props) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    // Spans, not divs, so it can sit inside a button.
    <span className={`relative block ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      <span className="block size-full" aria-hidden>
        <RadialBarChart
          responsive
          style={{ width: '100%', height: '100%' }}
          data={[{ pct }]}
          innerRadius={`${(1 - thickness) * 100}%`}
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          barCategoryGap={0}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          accessibilityLayer={false}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar dataKey="pct" fill={color} background={{ fill: trackColor }} />
        </RadialBarChart>
      </span>
      {children && <span className="absolute inset-0 grid place-items-center">{children}</span>}
    </span>
  )
}
