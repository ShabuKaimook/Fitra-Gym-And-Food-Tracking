// shortcut: sample records for Mon 16 – Thu 19 Nov 2026; delete this file once the services call the API.
// Days outside this range have no records, so the UI shows its empty states.
import type {
  DailyCalories,
  DailyMacros,
  DailyMicronutrients,
  DailyWater,
  Food,
  FoodEntry,
  Micronutrient,
} from './FoodService/types/Food'
import type { DailyActivity, DailySleep, DailyWeight } from './HealthService/types/Health'
import type { PlannedWorkout } from './WorkoutService/types/Workout'

export const CALORIES: DailyCalories[] = [
  { date: '2026-11-16', eaten: 2050, target: 2200 },
  { date: '2026-11-17', eaten: 2310, target: 2200 },
  { date: '2026-11-18', eaten: 1780, target: 2200 },
  { date: '2026-11-19', eaten: 960, target: 2200 },
]

const macros = (date: string, protein: number, carbs: number, fat: number): DailyMacros => ({
  date,
  protein: { grams: protein, target: 150 },
  carbs: { grams: carbs, target: 250 },
  fat: { grams: fat, target: 75 },
})

export const MACROS: DailyMacros[] = [
  macros('2026-11-16', 140, 230, 68),
  macros('2026-11-17', 155, 262, 80),
  macros('2026-11-18', 121, 190, 60),
  macros('2026-11-19', 92, 140, 38),
]

// Name, unit, daily target, then one value per day (16, 17, 18, 19). null = not tracked.
const MICRO_ROWS: [string, string, number, (number | null)[]][] = [
  ['Fiber', 'g', 30, [28, 24, 31, 14]],
  ['Sugar', 'g', 50, [42, 61, 35, 38]],
  ['Sodium', 'mg', 2300, [2150, 2680, 1900, 1420]],
  ['Potassium', 'mg', 3500, [3100, 2900, 3400, null]],
  ['Saturated fat', 'g', 20, [18, 24, 15, 9]],
  ['Cholesterol', 'mg', 300, [260, 340, 210, 180]],
  ['Calcium', 'mg', 1000, [870, 940, 1020, 410]],
  ['Iron', 'mg', 18, [14, 16, 12, 7]],
  ['Vitamin C', 'mg', 90, [110, 75, 95, 40]],
  ['Vitamin D', 'µg', 20, [null, 12, null, null]],
  ['Magnesium', 'mg', 400, [360, 310, 390, 150]],
  ['Zinc', 'mg', 11, [10, 12, 9, 4]],
]

export const MICRONUTRIENTS: DailyMicronutrients[] = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19'].map(
  (date, day) => ({
    date,
    items: MICRO_ROWS.map(([name, unit, target, values]): Micronutrient => ({
      name,
      unit,
      target,
      value: values[day],
    })),
  }),
)

// Foods logged through the food log; the daily totals above stand in for older entries.
export const FOOD_ENTRIES: FoodEntry[] = []

export const FOODS: Food[] = [
  {
    id: 'khao-man-gai',
    name: 'Khao man gai',
    brand: null,
    unit: 'g',
    per: 350,
    serving: { name: 'plate', size: 350 },
    nutrients: { calories: 640, protein: 32, carbs: 70, fat: 24, fiber: 2, sodium: 1200 },
  },
  {
    id: 'chicken-rice-bowl-7-eleven',
    name: 'Chicken rice bowl',
    brand: '7-Eleven',
    unit: 'g',
    per: 300,
    serving: { name: 'pack', size: 300 },
    nutrients: { calories: 480, protein: 28, carbs: 62, fat: 12, fiber: 1.5, sodium: 980 },
  },
  {
    id: 'steamed-rice',
    name: 'Steamed rice',
    brand: null,
    unit: 'g',
    per: 100,
    serving: null,
    nutrients: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: null },
  },
  {
    id: 'hainanese-chicken',
    name: 'Hainanese chicken',
    brand: null,
    unit: 'g',
    per: 100,
    serving: null,
    nutrients: { calories: 215, protein: null, carbs: null, fat: null, fiber: null, sodium: null },
  },
  {
    id: 'boiled-egg',
    name: 'Boiled egg',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { name: 'egg', size: 50 },
    nutrients: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sodium: 124 },
  },
  {
    id: 'pad-kra-pao',
    name: 'Pad kra pao with rice',
    brand: null,
    unit: 'g',
    per: 400,
    serving: { name: 'plate', size: 400 },
    nutrients: { calories: 620, protein: 30, carbs: 75, fat: 22, fiber: 3, sodium: 1500 },
  },
  {
    id: 'thai-milk-tea',
    name: 'Thai milk tea',
    brand: null,
    unit: 'ml',
    per: 100,
    serving: { name: 'glass', size: 350 },
    nutrients: { calories: 75, protein: 1.2, carbs: 13, fat: 2, fiber: 0, sodium: null },
  },
  {
    id: 'banana',
    name: 'Banana',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { name: 'banana', size: 120 },
    nutrients: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1 },
  },
]

export const WATER: DailyWater[] = [
  { date: '2026-11-16', liters: 2.3, target: 2.5 },
  { date: '2026-11-17', liters: 2.6, target: 2.5 },
  { date: '2026-11-18', liters: 1.9, target: 2.5 },
  { date: '2026-11-19', liters: 1.0, target: 2.5 },
]

export const SLEEP: DailySleep[] = [
  { date: '2026-11-16', minutes: 450, target: 480 },
  { date: '2026-11-17', minutes: 395, target: 480 },
  { date: '2026-11-18', minutes: 485, target: 480 },
  { date: '2026-11-19', minutes: 430, target: 480 },
]

// Weighed on two of the four days.
export const WEIGHT: DailyWeight[] = [
  { date: '2026-11-16', kg: 72.4 },
  { date: '2026-11-18', kg: 72.1 },
]

export const ACTIVITY: DailyActivity[] = [
  { date: '2026-11-16', steps: 9800, stepsTarget: 10000, cardioMinutes: 30 },
  { date: '2026-11-17', steps: 7200, stepsTarget: 10000, cardioMinutes: null },
  { date: '2026-11-18', steps: 11240, stepsTarget: 10000, cardioMinutes: 25 },
  { date: '2026-11-19', steps: 6420, stepsTarget: 10000, cardioMinutes: null },
]

// Wednesday is a rest day: no workout planned.
export const WORKOUTS: PlannedWorkout[] = [
  { date: '2026-11-16', name: 'Pull day', exercises: 6, minutes: 50 },
  { date: '2026-11-17', name: 'Leg day', exercises: 5, minutes: 60 },
  { date: '2026-11-19', name: 'Push day', exercises: 6, minutes: 55 },
]
