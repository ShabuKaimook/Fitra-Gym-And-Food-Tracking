import type { MicroKey } from '@/services/FoodService/types/Food'
import {
  Banana,
  Beef,
  Candy,
  Citrus,
  Droplet,
  FlaskConical,
  HeartPulse,
  Leaf,
  Magnet,
  Milk,
  Nut,
  Shield,
  Sparkles,
  Sun,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

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

// Micronutrients a food can carry beyond the macros (see Nutrients), in the home card's order.
// `label` matches the daily micronutrient names so logged food adds to the right row.
export const MICROS: { key: MicroKey; label: string; unit: string; icon: LucideIcon }[] = [
  { key: 'fiber', label: 'Fiber', unit: 'g', icon: Leaf },
  { key: 'sugar', label: 'Sugar', unit: 'g', icon: Candy },
  { key: 'sodium', label: 'Sodium', unit: 'mg', icon: FlaskConical },
  { key: 'potassium', label: 'Potassium', unit: 'mg', icon: Banana },
  { key: 'saturatedFat', label: 'Saturated fat', unit: 'g', icon: Droplet },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg', icon: HeartPulse },
  { key: 'calcium', label: 'Calcium', unit: 'mg', icon: Milk },
  { key: 'iron', label: 'Iron', unit: 'mg', icon: Magnet },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', icon: Citrus },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'µg', icon: Sun },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg', icon: Sparkles },
  { key: 'zinc', label: 'Zinc', unit: 'mg', icon: Shield },
]
