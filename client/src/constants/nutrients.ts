import { Beef, FlaskConical, Leaf, Nut, Wheat, type LucideIcon } from 'lucide-react'

// The three macros in display order, with their fixed data colour (design-system.md).
// Full class names so Tailwind finds them; `color` is for charts that take a CSS colour.
export const MACROS: {
  key: 'protein' | 'carbs' | 'fat'
  label: string
  icon: LucideIcon
  text: string
  bg: string
  color: string
}[] = [
  {
    key: 'protein',
    label: 'Protein',
    icon: Beef,
    text: 'text-protein',
    bg: 'bg-protein',
    color: 'var(--color-protein)',
  },
  { key: 'carbs', label: 'Carbs', icon: Wheat, text: 'text-carbs', bg: 'bg-carbs', color: 'var(--color-carbs)' },
  { key: 'fat', label: 'Fat', icon: Nut, text: 'text-fat', bg: 'bg-fat', color: 'var(--color-fat)' },
]

// Micronutrients a food can carry beyond the macros (see Nutrients). `max` is the largest sane
// amount per food, used to validate the new food form.
export const MICROS: {
  key: 'fiber' | 'sodium'
  label: string
  unit: string
  max: number
  icon: LucideIcon
}[] = [
  { key: 'fiber', label: 'Fiber', unit: 'g', max: 1000, icon: Leaf },
  { key: 'sodium', label: 'Sodium', unit: 'mg', max: 100000, icon: FlaskConical },
]
