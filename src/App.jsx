import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Auth from './pages/Auth'
import Homepage from './pages/Homepage'
import Footer from './components/Footer'
import Profile from './components/profile'
import WeeklyPlanner from './components/weeklyplanner'
import Grocery from './pages/Grocery'
import Budget from './pages/Budget'
import {
  createEmptyPlanner,
  createPlannerForDates,
  generateWeekDates,
  getIsoDate,
  mealTypes,
  ingredientMap,
  readStoredValue,
  normalizePlanner,
  getMealName,
  formatKes,
} from './lib/planner'

function App() {
  const [page, setPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('signin')
  const [role, setRole] = useState('guest')
  const [currentUser, setCurrentUser] = useState(null)
  const [ingredientOverrides, setIngredientOverrides] = useState({})
  const [customIngredients, setCustomIngredients] = useState([])
  const [savedMeals, setSavedMeals] = useState([])
  const [favoriteMealIds, setFavoriteMealIds] = useState([])
  const [weekStartDate, setWeekStartDate] = useState(getIsoDate())
  const [weeklyPlanner, setWeeklyPlanner] = useState(createEmptyPlanner())
  const [budget, setBudget] = useState(0)

  const userKey = useCallback((suffix) => {
    const username = currentUser?.username
    return username ? `savvyspoon.user.${username}.${suffix}` : null
  }, [currentUser])

  const weekDates = useMemo(() => generateWeekDates(weekStartDate), [weekStartDate])
  const getMealSlotKey = (day, mealType) => `${day}::${mealType}`

  const weekRows = Object.entries(weeklyPlanner)
  const groceryList = useMemo(() => {
    const findLegacyOverride = (mealName, ingredientName) => {
      const legacyId = `${mealName.toLowerCase()}::${ingredientName.toLowerCase()}`
      return ingredientOverrides[legacyId] || {}
    }

    const resolveMealClassification = (item) => {
      if (item?.day && item?.mealType) return { day: item.day, mealType: item.mealType }
      const itemMealName = (item?.mealName || '').trim().toLowerCase()
      if (!itemMealName) return { day: '', mealType: '' }
      for (const [day, meals] of Object.entries(weeklyPlanner)) {
        for (const mealType of mealTypes) {
          const slotMeal = getMealName(meals?.[mealType]).trim().toLowerCase()
          if (slotMeal && slotMeal === itemMealName) {
            return { day, mealType }
          }
        }
      }
      return { day: '', mealType: '' }
    }

    const mealEntries = Object.entries(weeklyPlanner).flatMap(([day, meals]) =>
      mealTypes
        .map((type) => ({
          day,
          mealType: type,
          mealName: getMealName(meals?.[type]).trim(),
        }))
        .filter((entry) => Boolean(entry.mealName)),
    )

    const groupedByMealIngredient = mealEntries.reduce((acc, mealEntry) => {
      const words = mealEntry.mealName.toLowerCase().split(/[\s&-]+/)
      const ingredients = [...new Set(words.map((word) => ingredientMap[word]).filter(Boolean))]

      ingredients.forEach((ingredientName) => {
        const id = `${mealEntry.day}::${mealEntry.mealType}::${mealEntry.mealName.toLowerCase()}::${ingredientName.toLowerCase()}`
        if (!acc[id]) {
          acc[id] = {
            id,
            day: mealEntry.day,
            mealType: mealEntry.mealType,
            mealName: mealEntry.mealName,
            ingredientName,
            count: 0,
          }
        }
        acc[id].count += 1
      })

      return acc
    }, {})

    const generatedItems = Object.values(groupedByMealIngredient)
      .map((item) => {
        const override = {
          ...findLegacyOverride(item.mealName, item.ingredientName),
          ...(ingredientOverrides[item.id] || {}),
        }
        if (override.deleted) return null
        return {
          id: item.id,
          day: override.day || item.day,
          mealType: override.mealType || item.mealType,
          mealName: item.mealName,
          ingredientName: item.ingredientName,
          count: item.count,
          unit: override.unit || 'pcs',
          quantity:
            typeof override.quantity === 'number' && !Number.isNaN(override.quantity)
              ? override.quantity
              : item.count,
          price:
            typeof override.price === 'number' && !Number.isNaN(override.price)
              ? override.price
              : 0,
        }
      })
      .filter(Boolean)
    const customItems = (customIngredients || [])
      .map((item) => {
        const classification = resolveMealClassification(item)
        const override = ingredientOverrides[item.id] || {}
        if (override.deleted) return null
        return {
          id: item.id,
          day: override.day || classification.day,
          mealType: override.mealType || classification.mealType,
          mealName: item.mealName || 'Custom',
          ingredientName: item.ingredientName || '',
          count: 1,
          unit: override.unit || item.unit || 'pcs',
          quantity:
            typeof override.quantity === 'number' && !Number.isNaN(override.quantity)
              ? override.quantity
              : Number(item.quantity || 1),
          price:
            typeof override.price === 'number' && !Number.isNaN(override.price)
              ? override.price
              : Number(item.price || 0),
        }
      })
      .filter(Boolean)

    return [...generatedItems, ...customItems].sort((a, b) => a.mealName.localeCompare(b.mealName))
  }, [weeklyPlanner, ingredientOverrides, customIngredients])

  const mealSlotCosts = useMemo(
    () =>
      groceryList.reduce((acc, item) => {
        if (!item.day || !item.mealType) return acc
        const key = getMealSlotKey(item.day, item.mealType)
        const amount = Number(item.price || 0) * Number(item.quantity || 0)
        acc[key] = (acc[key] || 0) + amount
        return acc
      }, {}),
    [groceryList],
  )

  const getMealCostForDay = useCallback(
    (day, mealType) => Number(mealSlotCosts[getMealSlotKey(day, mealType)] || 0),
    [mealSlotCosts],
  )

  const dayTotals = useMemo(
    () =>
      weekDates.map((day) => ({
        day,
        total: mealTypes.reduce((sum, type) => sum + getMealCostForDay(day, type), 0),
      })),
    [weekDates, getMealCostForDay],
  )

  const weeklyTotal = useMemo(
    () =>
      groceryList.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [groceryList],
  )
  const isUnderBudget = weeklyTotal <= budget

  const updateIngredientField = (id, field, value) => {
    setIngredientOverrides((current) => {
      const previous = current[id] || {}
      const parsedNumber = Number(value || 0)
      const nextForId =
        field === 'unit' || field === 'day' || field === 'mealType'
          ? { ...previous, [field]: value, deleted: false }
          : {
              ...previous,
              [field]: Number.isNaN(parsedNumber) ? 0 : parsedNumber,
              deleted: false,
            }
      return { ...current, [id]: nextForId }
    })
  }

  const deleteIngredientRow = (id) => {
    setIngredientOverrides((current) => {
      const previous = current[id] || {}
      return { ...current, [id]: { ...previous, deleted: true } }
    })
  }

  const addIngredientRow = (payload) => {
    const ingredientName = (payload?.ingredientName || '').trim()
    const mealName = (payload?.mealName || '').trim() || 'Custom'
    if (!ingredientName) return

    const id = `custom::${Date.now()}::${ingredientName.toLowerCase()}`
    const item = {
      id,
      day: payload?.day || '',
      mealType: payload?.mealType || '',
      mealName,
      ingredientName,
      unit: payload?.unit || 'pcs',
      quantity: Number(payload?.quantity || 1),
      price: Number(payload?.price || 0),
    }

    setCustomIngredients((current) => {
      return [...current, item]
    })
  }

  const saveMealToLibrary = (mealName) => {
    const name = (mealName || '').trim()
    if (!name) return
    setSavedMeals((current) => {
      const exists = current.some((meal) => meal.name.toLowerCase() === name.toLowerCase())
      if (exists) return current
      return [...current, { id: `meal-${Date.now()}`, name }]
    })
  }

  const toggleFavoriteMeal = (mealId) => {
    setFavoriteMealIds((current) =>
      current.includes(mealId) ? current.filter((id) => id !== mealId) : [...current, mealId],
    )
  }

  const applyMealFromLibrary = (meal, day, mealType) => {
    if (!meal?.name || !day || !mealType) return
    setWeeklyPlanner((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [mealType]: {
          ...current[day][mealType],
          name: meal.name,
        },
      },
    }))
  }

  const changeWeekStartDate = (nextDate) => {
    if (!nextDate) return
    setWeekStartDate(nextDate)
    const requiredDates = generateWeekDates(nextDate)
    if (role === 'account' && currentUser?.username) {
      const storedPlanner = readStoredValue(
        `savvyspoon.user.${currentUser.username}.weeklyPlan.${nextDate}`,
        createPlannerForDates(requiredDates),
      )
      setWeeklyPlanner(normalizePlanner(storedPlanner, requiredDates))
      return
    }
    setWeeklyPlanner(createPlannerForDates(requiredDates))
  }

  const allowAccess = (authData) => {
    const nextRole = authData?.role === 'account' ? 'account' : 'guest'
    const profile = authData?.profile || null
    setIsAuthenticated(true)
    setRole(nextRole)
    setCurrentUser(profile)
    if (nextRole === 'account' && profile?.username) {
      const storedWeekStart = readStoredValue(`savvyspoon.user.${profile.username}.weekStartDate`, getIsoDate())
      const requiredDates = generateWeekDates(storedWeekStart)
      const planner = normalizePlanner(
        readStoredValue(
          `savvyspoon.user.${profile.username}.weeklyPlan.${storedWeekStart}`,
          createPlannerForDates(requiredDates),
        ),
        requiredDates,
      )
      const nextBudget = Number(readStoredValue(`savvyspoon.user.${profile.username}.budget`, 0))
      const overrides = readStoredValue(`savvyspoon.user.${profile.username}.ingredientOverrides`, {})
      const customs = readStoredValue(`savvyspoon.user.${profile.username}.customIngredients`, [])
      const saved = readStoredValue(`savvyspoon.user.${profile.username}.savedMeals`, [])
      const favorites = readStoredValue(`savvyspoon.user.${profile.username}.favoriteMealIds`, [])
      setWeekStartDate(storedWeekStart)
      setWeeklyPlanner(planner)
      setBudget(nextBudget)
      setIngredientOverrides(overrides)
      setCustomIngredients(customs)
      setSavedMeals(saved)
      setFavoriteMealIds(favorites)
    } else {
      const guestWeekStart = getIsoDate()
      setWeekStartDate(guestWeekStart)
      setWeeklyPlanner(createPlannerForDates(generateWeekDates(guestWeekStart)))
      setBudget(0)
      setIngredientOverrides({})
      setCustomIngredients([])
      setSavedMeals([])
      setFavoriteMealIds([])
    }
    setPage('home')
  }

  const navigate = (nextPage) => {
    if (nextPage === 'library') {
      setPage('planner')
      return
    }
    if (role === 'guest' && nextPage !== 'home') return
    setPage(nextPage)
  }

  const updateBudget = (nextBudget) => {
    const parsed = Number(nextBudget || 0)
    setBudget(parsed)
  }

  const openCreateAccount = () => {
    setAuthInitialMode('signup')
    setPage('auth')
    setIsAuthenticated(false)
    setRole('guest')
    setCurrentUser(null)
  }

  const logoutToAuth = () => {
    setAuthInitialMode('signin')
    setIsAuthenticated(false)
    setPage('auth')
    setRole('guest')
    setCurrentUser(null)
    setWeekStartDate(getIsoDate())
    setWeeklyPlanner(createEmptyPlanner())
    setBudget(0)
    setIngredientOverrides({})
    setCustomIngredients([])
    setSavedMeals([])
    setFavoriteMealIds([])
  }

  useEffect(() => {
    if (!isAuthenticated || role !== 'account') return
    const plannerStorageKey = userKey(`weeklyPlan.${weekStartDate}`)
    const budgetStorageKey = userKey('budget')
    const overridesStorageKey = userKey('ingredientOverrides')
    const customStorageKey = userKey('customIngredients')
    const savedMealsStorageKey = userKey('savedMeals')
    const favoriteMealsStorageKey = userKey('favoriteMealIds')
    const weekStartStorageKey = userKey('weekStartDate')
    if (
      !plannerStorageKey ||
      !budgetStorageKey ||
      !overridesStorageKey ||
      !customStorageKey ||
      !savedMealsStorageKey ||
      !favoriteMealsStorageKey ||
      !weekStartStorageKey
    )
      return

    localStorage.setItem(plannerStorageKey, JSON.stringify(weeklyPlanner))
    localStorage.setItem(budgetStorageKey, JSON.stringify(budget))
    localStorage.setItem(overridesStorageKey, JSON.stringify(ingredientOverrides))
    localStorage.setItem(customStorageKey, JSON.stringify(customIngredients))
    localStorage.setItem(savedMealsStorageKey, JSON.stringify(savedMeals))
    localStorage.setItem(favoriteMealsStorageKey, JSON.stringify(favoriteMealIds))
    localStorage.setItem(weekStartStorageKey, JSON.stringify(weekStartDate))
  }, [
    isAuthenticated,
    role,
    currentUser,
    weeklyPlanner,
    budget,
    ingredientOverrides,
    customIngredients,
    savedMeals,
    favoriteMealIds,
    weekStartDate,
    userKey,
  ])

  const appBg = {
    backgroundImage:
      "linear-gradient(rgba(255,246,233,0.86), rgba(255,246,233,0.9)), url('/food.webp')",
  }

  const plannerBg = {
    backgroundImage: "url('/spicy.jpg')",
  }

  const budgetBg = {
    backgroundImage: "url('/tasty.jpg')",
  }

  if (!isAuthenticated) return <Auth onAuthSuccess={allowAccess} initialMode={authInitialMode} />

  if (page === 'home') {
    return (
      <>
        <Homepage
          onGoProfile={() => navigate('profile')}
          onGoPlanner={() => navigate('planner')}
          onNavigate={navigate}
          onLogout={logoutToAuth}
          role={role}
          onCreateAccount={openCreateAccount}
        />
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'planner') {
    return (
      <>
        <main className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={plannerBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header
              budget={budget}
              currentPage="planner"
              onNavigate={navigate}
              onLogout={logoutToAuth}
              showSpend
              totalSpent={weeklyTotal}
            />
            <WeeklyPlanner
              weeklyPlanner={weeklyPlanner}
              setWeeklyPlanner={setWeeklyPlanner}
              getMealCostForDay={getMealCostForDay}
              savedMeals={savedMeals}
              onSaveMealToLibrary={saveMealToLibrary}
              weekDates={weekDates}
              weekStartDate={weekStartDate}
              onWeekStartDateChange={changeWeekStartDate}
              favoriteMealIds={favoriteMealIds}
              onToggleFavorite={toggleFavoriteMeal}
              onApplyMealToPlanner={applyMealFromLibrary}
            />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'grocery') {
    return (
      <>
        <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header
              budget={budget}
              currentPage="grocery"
              onNavigate={navigate}
              onLogout={logoutToAuth}
              showSpend
              totalSpent={weeklyTotal}
            />
            <Grocery
              groceryList={groceryList}
              weekDates={weekDates}
              formatKes={formatKes}
              onAddIngredient={addIngredientRow}
              onDeleteIngredient={deleteIngredientRow}
              onUpdateIngredient={updateIngredientField}
            />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'budget') {
    return (
      <>
        <main className="min-h-screen bg-cover bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={budgetBg}>
          <div className="space-y-6">
            <Header
              budget={budget}
              currentPage="budget"
              onNavigate={navigate}
              onLogout={logoutToAuth}
              showSpend
              totalSpent={weeklyTotal}
            />
            <Budget
              budget={budget}
              weeklyTotal={weeklyTotal}
              dayTotals={dayTotals}
              formatKes={formatKes}
              groceryList={groceryList}
              updateBudget={updateBudget}
              statusStorageKey={userKey('budgetStatus') || 'savvyspoon.budgetStatus'}
            />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'profile') {
    return (
      <>
        <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header
              budget={budget}
              currentPage="profile"
              onNavigate={navigate}
              onLogout={logoutToAuth}
              showSpend
              totalSpent={weeklyTotal}
            />
            <Profile
              userProfile={currentUser}
              weeklyTotal={weeklyTotal}
              budget={budget}
              isUnderBudget={isUnderBudget}
              weekRows={weekRows}
              groceryList={groceryList}
              getMealCostForDay={getMealCostForDay}
              formatKes={formatKes}
            />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  return null
}

export default App
