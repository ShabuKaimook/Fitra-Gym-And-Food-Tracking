import { Bar, BarChart, XAxis, YAxis } from 'recharts'

type Props = {
  value: number
  max: number
  /** Fill colour, e.g. 'var(--color-protein)'. */
  color: string
  trackColor?: string
  /** Height defaults to 8px; pass layout classes here (e.g. a grid-area). */
  className?: string
}

// Horizontal progress meter (Recharts bar), fully rounded, capped at 100%.
// Decorative: the numbers next to it carry the meaning for screen readers.
export const ProgressBar = ({ value, max, color, trackColor = 'var(--color-canvas)', className = '' }: Props) => (
  <div className={`h-2 min-w-7.5 ${className}`} aria-hidden>
    <BarChart
      responsive
      style={{ width: '100%', height: '100%' }}
      layout="vertical"
      data={[{ value: Math.min(Math.max(0, value), max) }]}
      barCategoryGap={0}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      accessibilityLayer={false}
    >
      <XAxis type="number" domain={[0, max > 0 ? max : 1]} hide />
      <YAxis type="category" hide />
      <Bar dataKey="value" fill={color} radius={4} background={{ fill: trackColor, radius: 4 }} />
    </BarChart>
  </div>
)
