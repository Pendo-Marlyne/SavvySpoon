export const mealTypes = ['breakfast', 'lunch', 'dinner']

export const getIsoDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const generateWeekDates = (startDateIso = getIsoDate()) => {
  const start = new Date(`${startDateIso}T00:00:00`)
  if (Number.isNaN(start.getTime())) return [getIsoDate()]
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return getIsoDate(date)
  })
}

export const createPlannerForDates = (dates = generateWeekDates()) =>
  dates.reduce((acc, dateKey) => {
    acc[dateKey] = {
      breakfast: { name: '', cost: 0 },
      lunch: { name: '', cost: 0 },
      dinner: { name: '', cost: 0 },
    }
    return acc
  }, {})

export const createEmptyPlanner = () => createPlannerForDates(generateWeekDates())

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

export const normalizePlanner = (planner, requiredDates = Object.keys(planner || {})) => {
  const source = planner || {}
  const base = {}
  requiredDates.forEach((day) => {
    const meals = source[day] || {}
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
