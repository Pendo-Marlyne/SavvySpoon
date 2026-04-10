export const mealTypes = ['breakfast', 'lunch', 'dinner']

export const createEmptyPlanner = () => ({
  monday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  tuesday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  wednesday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  thursday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  friday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  saturday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
  sunday: {
    breakfast: { name: '', cost: 0 },
    lunch: { name: '', cost: 0 },
    dinner: { name: '', cost: 0 },
  },
})

export const defaultPlanner = createEmptyPlanner()

export const ingredientMap = {
  oat: 'Oats',
  porridge: 'Milk',
  fruit: 'Mixed fruits',
  chicken: 'Chicken breast',
  rice: 'Rice',
  beef: 'Beef',
  stew: 'Tomatoes',
  ugali: 'Maize flour',
  fish: 'Fish fillet',
  curry: 'Curry spice',
  pasta: 'Pasta',
  biryani: 'Biryani spice',
  egg: 'Eggs',
  toast: 'Bread',
  yogurt: 'Yogurt',
}

export const readStoredValue = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const normalizePlanner = (planner) => {
  const base = {}
  Object.entries(planner || {}).forEach(([day, meals]) => {
    base[day] = {}
    mealTypes.forEach((mealType) => {
      const mealValue = meals?.[mealType]
      if (typeof mealValue === 'number') {
        base[day][mealType] = { name: '', cost: mealValue }
      } else {
        base[day][mealType] = {
          name: mealValue?.name || '',
          cost: Number(mealValue?.cost || 0),
        }
      }
    })
  })
  return base
}

export const getMealCost = (meal) => Number((typeof meal === 'number' ? meal : meal?.cost) || 0)
export const getMealName = (meal) => (typeof meal === 'number' ? '' : meal?.name || '')

export const formatKes = (value) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(
    Number(value || 0),
  )
