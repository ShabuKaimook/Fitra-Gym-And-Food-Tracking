// shortcut: sample records for Mon 16 – Thu 19 Nov 2026 (planned workouts run to Sat 28 Nov); delete this file once the services call the API.
// Days outside this range have no records, so the UI shows its empty states.
import type {
  DailyCalories,
  DailyMacros,
  DailyMicronutrients,
  DailyWater,
  Food,
  FoodEntry,
  MealOption,
  Micronutrient,
  Unit,
} from './FoodService/types/Food'
import type {
  DailyActivity,
  DailyNote,
  DailyScore,
  DailySleep,
  DailyWaist,
  DailyWeight,
} from './HealthService/types/Health'
import type {
  Equipment,
  Exercise,
  ExerciseOptions,
  Muscle,
  PlannedExercise,
  PlannedWorkout,
  Split,
  TrainingPlan,
  WorkoutSession,
  WorkoutTemplate,
} from './WorkoutService/types/Workout'

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

// Meal groups in the order they happen in a day.
export const MEALS: MealOption[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snacks', label: 'Snacks' },
]

// size: typical g (ml) in one, for converting a food to a unit it has no size for.
export const UNITS: Unit[] = [
  { id: 'g', label: 'Grams (g)', kind: 'base', size: 1 },
  { id: 'ml', label: 'Millilitres (ml)', kind: 'base', size: 1 },
  { id: 'serving', label: 'Serving', kind: 'portion', size: 100 },
  { id: 'bowl', label: 'Bowl', kind: 'portion', size: 250 },
  { id: 'can', label: 'Can', kind: 'portion', size: 325 },
  { id: 'piece', label: 'Piece', kind: 'portion', size: 50 },
  { id: 'plate', label: 'Plate', kind: 'portion', size: 350 },
  { id: 'slice', label: 'Slice', kind: 'portion', size: 30 },
  { id: 'teaspoon', label: 'Teaspoon', kind: 'portion', size: 5 },
  { id: 'tablespoon', label: 'Tablespoon', kind: 'portion', size: 15 },
  { id: 'pack', label: 'Pack', kind: 'portion', size: 60 },
  { id: 'box', label: 'Box', kind: 'portion', size: 300 },
  { id: 'bottle', label: 'Bottle', kind: 'portion', size: 500 },
  { id: 'cup', label: 'Cup', kind: 'portion', size: 240 },
]

// Foods logged through the food log; the daily totals above stand in for older entries.
export const FOOD_ENTRIES: FoodEntry[] = []

export const FOODS: Food[] = [
  {
    id: 'khao-man-gai',
    name: 'Khao man gai',
    brand: null,
    unit: 'g',
    per: 350,
    serving: { unit: 'plate', size: 350 },
    nutrients: { calories: 640, protein: 32, carbs: 70, fat: 24, fiber: 2, sodium: 1200 },
  },
  {
    id: 'chicken-rice-bowl-7-eleven',
    name: 'Chicken rice bowl',
    brand: '7-Eleven',
    unit: 'g',
    per: 300,
    serving: { unit: 'box', size: 300 },
    nutrients: { calories: 480, protein: 28, carbs: 62, fat: 12, fiber: 1.5, sodium: 980 },
  },
  {
    id: 'steamed-rice',
    name: 'Steamed rice',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { unit: 'bowl', size: 150 },
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
    serving: { unit: 'piece', size: 50 },
    nutrients: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sodium: 124 },
  },
  {
    id: 'pad-kra-pao',
    name: 'Pad kra pao with rice',
    brand: null,
    unit: 'g',
    per: 400,
    serving: { unit: 'plate', size: 400 },
    nutrients: { calories: 620, protein: 30, carbs: 75, fat: 22, fiber: 3, sodium: 1500 },
  },
  {
    id: 'thai-milk-tea',
    name: 'Thai milk tea',
    brand: null,
    unit: 'ml',
    per: 100,
    serving: { unit: 'cup', size: 350 },
    nutrients: { calories: 75, protein: 1.2, carbs: 13, fat: 2, fiber: 0, sodium: null },
  },
  {
    id: 'banana',
    name: 'Banana',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { unit: 'piece', size: 120 },
    nutrients: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1 },
  },
  {
    id: 'coke-can',
    name: 'Coca-Cola',
    brand: 'Coca-Cola',
    unit: 'ml',
    per: 100,
    serving: { unit: 'can', size: 325 },
    nutrients: { calories: 42, protein: 0, carbs: 10.6, fat: 0, fiber: 0, sodium: 4 },
  },
  {
    id: 'drinking-water-bottle',
    name: 'Drinking water',
    brand: null,
    unit: 'ml',
    per: 100,
    serving: { unit: 'bottle', size: 600 },
    nutrients: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  },
  {
    id: 'white-bread',
    name: 'White bread',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { unit: 'slice', size: 30 },
    nutrients: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sodium: 490 },
  },
  {
    id: 'peanut-butter',
    name: 'Peanut butter',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { unit: 'tablespoon', size: 16 },
    nutrients: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sodium: 430 },
  },
  {
    id: 'sugar',
    name: 'Sugar',
    brand: null,
    unit: 'g',
    per: 100,
    serving: { unit: 'teaspoon', size: 4 },
    nutrients: { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1 },
  },
  {
    id: 'whey-protein',
    name: 'Whey protein',
    brand: null,
    unit: 'g',
    per: 30,
    serving: { unit: 'serving', size: 30 },
    nutrients: { calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: null, sodium: 50 },
  },
  {
    id: 'instant-noodles',
    name: 'Instant noodles',
    brand: 'Mama',
    unit: 'g',
    per: 60,
    serving: { unit: 'pack', size: 60 },
    nutrients: { calories: 270, protein: 5, carbs: 38, fat: 11, fiber: null, sodium: 1300 },
  },
]

export const WATER: DailyWater[] = [
  { date: '2026-11-16', liters: 2.3, target: 2.5 },
  { date: '2026-11-17', liters: 2.6, target: 2.5 },
  { date: '2026-11-18', liters: 1.9, target: 2.5 },
  { date: '2026-11-19', liters: 1.0, target: 2.5 },
]

export const SLEEP: DailySleep[] = [
  { date: '2026-11-16', minutes: 450, target: 480, quality: 7 },
  { date: '2026-11-17', minutes: 395, target: 480, quality: 5 },
  { date: '2026-11-18', minutes: 485, target: 480, quality: 8 },
  { date: '2026-11-19', minutes: 430, target: 480, quality: null },
]

// Weighed on two of the four days.
export const WEIGHT: DailyWeight[] = [
  { date: '2026-11-16', kg: 72.4 },
  { date: '2026-11-18', kg: 72.1 },
]

export const WAIST: DailyWaist[] = [
  { date: '2026-11-16', cm: 81.5 },
  { date: '2026-11-18', cm: 81 },
]

export const ENERGY: DailyScore[] = [
  { date: '2026-11-16', score: 7 },
  { date: '2026-11-17', score: 5 },
  { date: '2026-11-18', score: 8 },
]

export const RECOVERY: DailyScore[] = [
  { date: '2026-11-16', score: 6 },
  { date: '2026-11-17', score: 4 },
  { date: '2026-11-18', score: 8 },
]

export const NOTES: DailyNote[] = [
  { date: '2026-11-16', text: 'Good legs session, slept a bit late.' },
  { date: '2026-11-18', text: 'Felt strong all day.' },
]

export const ACTIVITY: DailyActivity[] = [
  { date: '2026-11-16', steps: 9800, stepsTarget: 10000, cardioMinutes: 30 },
  { date: '2026-11-17', steps: 7200, stepsTarget: 10000, cardioMinutes: null },
  { date: '2026-11-18', steps: 11240, stepsTarget: 10000, cardioMinutes: 25 },
  { date: '2026-11-19', steps: 6420, stepsTarget: 10000, cardioMinutes: null },
]

// Wednesday is a rest day: no workout planned.
const PUSH: PlannedExercise[] = [
  { name: 'Bench press', sets: 3, reps: '8–12', restSeconds: 120 },
  { name: 'Overhead press', sets: 3, reps: '6–10', restSeconds: 120 },
  { name: 'Incline DB press', sets: 3, reps: '8–12', restSeconds: 90 },
  { name: 'Lateral raise', sets: 3, reps: '12–15', restSeconds: 60 },
  { name: 'Triceps pushdown', sets: 3, reps: '10–12', restSeconds: 60 },
  { name: 'Chest fly', sets: 3, reps: '12–15', restSeconds: 60 },
]
const PULL: PlannedExercise[] = [
  { name: 'Pull-up', sets: 3, reps: '6–10', restSeconds: 120 },
  { name: 'Barbell row', sets: 3, reps: '6–10', restSeconds: 120 },
  { name: 'Lat pulldown', sets: 3, reps: '8–12', restSeconds: 90 },
  { name: 'Seated cable row', sets: 3, reps: '10–12', restSeconds: 90 },
  { name: 'Face pull', sets: 3, reps: '12–15', restSeconds: 60 },
  { name: 'Biceps curl', sets: 3, reps: '10–12', restSeconds: 60 },
]
const LEGS: PlannedExercise[] = [
  { name: 'Back squat', sets: 3, reps: '5–8', restSeconds: 180 },
  { name: 'Romanian deadlift', sets: 3, reps: '8–10', restSeconds: 120 },
  { name: 'Leg press', sets: 3, reps: '10–12', restSeconds: 90 },
  { name: 'Leg curl', sets: 3, reps: '10–12', restSeconds: 60 },
  { name: 'Calf raise', sets: 4, reps: '12–15', restSeconds: 60 },
]
const workout = (
  date: string,
  name: string,
  minutes: number,
  exercises: PlannedExercise[],
  week: number,
  day: number,
) => ({
  date,
  name,
  minutes,
  exercises,
  planDay: { week, day },
})

// Push / Pull / Legs twice a week: week 2 of the plan, then week 3 (23 – 28 Nov).
export const WORKOUTS: PlannedWorkout[] = [
  workout('2026-11-16', 'Pull day', 50, PULL, 2, 2),
  workout('2026-11-17', 'Leg day', 60, LEGS, 2, 3),
  workout('2026-11-19', 'Push day', 55, PUSH, 2, 4),
  workout('2026-11-23', 'Push day', 55, PUSH, 3, 1),
  workout('2026-11-24', 'Pull day', 50, PULL, 3, 2),
  workout('2026-11-25', 'Leg day', 60, LEGS, 3, 3),
  workout('2026-11-26', 'Push day', 55, PUSH, 3, 4),
  workout('2026-11-27', 'Pull day', 50, PULL, 3, 5),
  workout('2026-11-28', 'Leg day', 60, LEGS, 3, 6),
]

// One letter per weekday, Mon first: '-' = rest, any other letter = that day of `names` ('a' = names[0]).
const days = (pattern: string, names: string[], exercises: Record<string, string[]> = {}) =>
  [...pattern].map((c) => {
    if (c === '-') return null
    const name = names[c.charCodeAt(0) - 97]
    return { name, exerciseIds: exercises[name] ?? [] }
  })

export const SPLITS: Split[] = [
  {
    id: 'my-4-day',
    name: 'My 4-day',
    kind: 'custom',
    days: days('ab-ab--', ['Upper', 'Lower'], {
      Upper: ['bench-press', 'seated-cable-row', 'lateral-raise'],
      Lower: ['back-squat', 'romanian-deadlift', 'leg-curl'],
    }),
  },
  { id: 'ppl', name: 'PPL', kind: 'builtin', days: days('abcabc-', ['Push', 'Pull', 'Legs']) },
  { id: 'upper-lower', name: 'Upper / Lower', kind: 'builtin', days: days('ab-ab--', ['Upper', 'Lower']) },
  {
    id: 'full-body',
    name: 'Full Body',
    kind: 'builtin',
    days: days('a-b-c--', ['Full body A', 'Full body B', 'Full body C']),
  },
  {
    id: 'bro',
    name: 'Body part',
    kind: 'builtin',
    days: days('abcde--', ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms']),
  },
]

const splitDays = (id: string) => SPLITS.find((s) => s.id === id)!.days
const plan = (
  id: string,
  name: string,
  splitId: string,
  status: TrainingPlan['status'],
  weeks: number,
  currentWeek: number,
): TrainingPlan => ({
  id,
  name,
  splitId,
  split: SPLITS.find((s) => s.id === splitId)!.name,
  status,
  weeks,
  currentWeek,
  schedule: [{ fromWeek: 1, days: structuredClone(splitDays(splitId)) }],
})

// One active plan; the other two use "My 4-day" so editing that split has plans to ask about.
export const PLANS: TrainingPlan[] = [
  { ...plan('hypertrophy', 'Hypertrophy block', 'ppl', 'active', 12, 3), split: 'Push / Pull / Legs' },
  plan('winter-cut', 'Winter cut', 'my-4-day', 'upcoming', 8, 0),
  plan('spring-strength', 'Spring strength', 'my-4-day', 'finished', 6, 6),
]

export const EXERCISE_OPTIONS: ExerciseOptions = {
  muscles: ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core'],
  equipment: ['Machine', 'Dumbbell', 'Barbell', 'Cable', 'Bodyweight'],
  secondaryMuscles: [
    'Biceps',
    'Rear delts',
    'Traps',
    'Forearms',
    'Lats',
    'Triceps',
    'Front delts',
    'Abs',
    'Glutes',
    'Quads',
    'Hamstrings',
    'Calves',
  ],
  recordTypes: [
    { value: 'weight-reps', label: 'Weight and reps' },
    { value: 'reps', label: 'Reps only' },
    { value: 'time', label: 'Time' },
  ],
  weightUnits: [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'level', label: 'Pin level (machine stack)' },
  ],
}

const ex = (name: string, muscle: Muscle, equipment: Equipment, favourite = false): Exercise => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  muscle,
  secondary: [],
  equipment,
  record: equipment === 'Bodyweight' ? 'reps' : 'weight-reps',
  weightUnit: equipment === 'Bodyweight' ? null : 'kg',
  howTo: '',
  favourite,
  custom: false,
})

export const EXERCISES: Exercise[] = [
  ex('Bench press', 'Chest', 'Barbell', true),
  ex('Incline DB press', 'Chest', 'Dumbbell', true),
  ex('DB bench press', 'Chest', 'Dumbbell', true),
  ex('DB fly', 'Chest', 'Dumbbell'),
  ex('Pullover', 'Chest', 'Dumbbell'),
  ex('Squeeze press', 'Chest', 'Dumbbell'),
  ex('Chest press machine', 'Chest', 'Machine'),
  ex('Cable crossover', 'Chest', 'Cable'),
  ex('Push-up', 'Chest', 'Bodyweight'),
  ex('Pull-up', 'Back', 'Bodyweight', true),
  ex('Barbell row', 'Back', 'Barbell', true),
  ex('Lat pulldown', 'Back', 'Cable'),
  ex('Seated cable row', 'Back', 'Cable', true),
  ex('One-arm DB row', 'Back', 'Dumbbell'),
  ex('Overhead press', 'Shoulders', 'Barbell', true),
  ex('Lateral raise', 'Shoulders', 'Dumbbell', true),
  ex('Face pull', 'Shoulders', 'Cable'),
  ex('Back squat', 'Legs', 'Barbell', true),
  ex('Romanian deadlift', 'Legs', 'Barbell', true),
  ex('Leg press', 'Legs', 'Machine'),
  ex('Leg curl', 'Legs', 'Machine'),
  ex('Walking lunge', 'Legs', 'Dumbbell'),
  ex('Calf raise', 'Legs', 'Machine'),
  ex('Biceps curl', 'Arms', 'Dumbbell'),
  ex('Triceps pushdown', 'Arms', 'Cable'),
  ex('Plank', 'Core', 'Bodyweight'),
  ex('Cable crunch', 'Core', 'Cable'),
]

export const TEMPLATES: WorkoutTemplate[] = [
  { id: 'quick-upper', name: 'Quick upper' },
  { id: 'arms', name: 'Arms finisher' },
  { id: 'hotel', name: 'Hotel gym' },
]

export const SESSIONS: WorkoutSession[] = [
  { date: '2026-11-16', name: 'Pull day' },
  { date: '2026-11-17', name: 'Leg day' },
  { date: '2026-11-19', name: 'Push day' },
  { date: '2026-11-23', name: 'Push day' },
]
