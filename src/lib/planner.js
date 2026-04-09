export const defaultPlanner = {
  monday: {
    breakfast: { name: 'Fruit Oat Porridge', cost: 350 },
    lunch: { name: 'Chicken Rice Bowl', cost: 600 },
    dinner: { name: 'Beef Stew & Ugali', cost: 850 },
  },
  tuesday: {
    breakfast: { name: 'Mandazi & Tea', cost: 320 },
    lunch: { name: 'Tilapia & Greens', cost: 620 },
    dinner: { name: 'Pilau with Kachumbari', cost: 880 },
  },
  wednesday: {
    breakfast: { name: 'Avocado Toast', cost: 360 },
    lunch: { name: 'Bean Stew & Rice', cost: 590 },
    dinner: { name: 'Roasted Chicken Tray', cost: 900 },
  },
  thursday: {
    breakfast: { name: 'Yoghurt Granola Bowl', cost: 330 },
    lunch: { name: 'Chapati Wraps', cost: 610 },
    dinner: { name: 'Fish Coconut Curry', cost: 870 },
  },
  friday: {
    breakfast: { name: 'Egg Muffin Sandwich', cost: 380 },
    lunch: { name: 'Pasta Primavera', cost: 650 },
    dinner: { name: 'Nyama Choma Platter', cost: 980 },
  },
  saturday: {
    breakfast: { name: 'Pancakes & Honey', cost: 420 },
    lunch: { name: 'Chicken Biryani', cost: 700 },
    dinner: { name: 'Creamy Stir Fry', cost: 1050 },
  },
  sunday: {
    breakfast: { name: 'Sweet Potato & Eggs', cost: 390 },
    lunch: { name: 'Githeri Special', cost: 680 },
    dinner: { name: 'Family Roast Dinner', cost: 950 },
  },
}

export const mealTypes = ['breakfast', 'lunch', 'dinner']

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
