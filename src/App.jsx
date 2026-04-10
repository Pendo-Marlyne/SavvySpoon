import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Auth from './components/Auth'
import Homepage from './components/Homepage'
import Footer from './components/Footer'
import Profile from './components/profile'
import WeeklyPlanner from './components/weeklyplanner'
import MealLibrary from './components/meallibrary'
import Grocery from './components/grocery'
import Budget from './components/budget'
import {
  createEmptyPlanner,
  mealTypes,
  ingredientMap,
  readStoredValue,
  normalizePlanner,
  getMealCost,
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
  const [weeklyPlanner, setWeeklyPlanner] = useState(createEmptyPlanner())
  const [budget, setBudget] = useState(0)

  const userKey = useCallback((suffix) => {
    const username = currentUser?.username
    return username ? `savvyspoon.user.${username}.${suffix}` : null
  }, [currentUser])

  const weekRows = Object.entries(weeklyPlanner)
  const dayTotals = useMemo(
    () =>
      weekRows.map(([day, meals]) => ({
        day,
        total: mealTypes.reduce((sum, type) => sum + getMealCost(meals[type]), 0),
      })),
    [weekRows],
  )
  const weeklyTotal = dayTotals.reduce((sum, row) => sum + row.total, 0)
  const isUnderBudget = weeklyTotal <= budget

  const mealLibrary = useMemo(() => savedMeals, [savedMeals])

  const groceryList = useMemo(() => {
    const mealEntries = Object.values(weeklyPlanner).flatMap((meals) =>
      mealTypes
        .map((type) => getMealName(meals?.[type]).trim())
        .filter(Boolean),
    )

    const groupedByMealIngredient = mealEntries.reduce((acc, mealName) => {
      const words = mealName.toLowerCase().split(/[\s&-]+/)
      const ingredients = [...new Set(words.map((word) => ingredientMap[word]).filter(Boolean))]

      ingredients.forEach((ingredientName) => {
        const id = `${mealName.toLowerCase()}::${ingredientName.toLowerCase()}`
        if (!acc[id]) {
          acc[id] = { id, mealName, ingredientName, count: 0 }
        }
        acc[id].count += 1
      })

      return acc
    }, {})

    const generatedItems = Object.values(groupedByMealIngredient)
      .map((item) => {
        const override = ingredientOverrides[item.id] || {}
        if (override.deleted) return null
        return {
          id: item.id,
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
        const override = ingredientOverrides[item.id] || {}
        if (override.deleted) return null
        return {
          id: item.id,
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

  const updateIngredientField = (id, field, value) => {
    setIngredientOverrides((current) => {
      const previous = current[id] || {}
      const parsedNumber = Number(value || 0)
      const nextForId =
        field === 'unit'
          ? { ...previous, unit: value, deleted: false }
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

  const saveMealToLibrary = (mealName, cost = 0) => {
    const name = (mealName || '').trim()
    if (!name) return
    setSavedMeals((current) => {
      const exists = current.some((meal) => meal.name.toLowerCase() === name.toLowerCase())
      if (exists) return current
      return [...current, { id: `meal-${Date.now()}`, name, defaultCost: Number(cost || 0) }]
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
          cost: Number(meal.defaultCost || current[day][mealType].cost || 0),
        },
      },
    }))
  }

  const allowAccess = (authData) => {
    const nextRole = authData?.role === 'account' ? 'account' : 'guest'
    const profile = authData?.profile || null
    setIsAuthenticated(true)
    setRole(nextRole)
    setCurrentUser(profile)
    if (nextRole === 'account' && profile?.username) {
      const planner = normalizePlanner(readStoredValue(`savvyspoon.user.${profile.username}.weeklyPlan`, createEmptyPlanner()))
      const nextBudget = Number(readStoredValue(`savvyspoon.user.${profile.username}.budget`, 0))
      const overrides = readStoredValue(`savvyspoon.user.${profile.username}.ingredientOverrides`, {})
      const customs = readStoredValue(`savvyspoon.user.${profile.username}.customIngredients`, [])
      const saved = readStoredValue(`savvyspoon.user.${profile.username}.savedMeals`, [])
      const favorites = readStoredValue(`savvyspoon.user.${profile.username}.favoriteMealIds`, [])
      setWeeklyPlanner(planner)
      setBudget(nextBudget)
      setIngredientOverrides(overrides)
      setCustomIngredients(customs)
      setSavedMeals(saved)
      setFavoriteMealIds(favorites)
    } else {
      setWeeklyPlanner(createEmptyPlanner())
      setBudget(0)
      setIngredientOverrides({})
      setCustomIngredients([])
      setSavedMeals([])
      setFavoriteMealIds([])
    }
    setPage('home')
  }

  const navigate = (nextPage) => {
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

  useEffect(() => {
    if (!isAuthenticated || role !== 'account') return
    const plannerStorageKey = userKey('weeklyPlan')
    const budgetStorageKey = userKey('budget')
    const overridesStorageKey = userKey('ingredientOverrides')
    const customStorageKey = userKey('customIngredients')
    const savedMealsStorageKey = userKey('savedMeals')
    const favoriteMealsStorageKey = userKey('favoriteMealIds')
    if (
      !plannerStorageKey ||
      !budgetStorageKey ||
      !overridesStorageKey ||
      !customStorageKey ||
      !savedMealsStorageKey ||
      !favoriteMealsStorageKey
    )
      return

    localStorage.setItem(plannerStorageKey, JSON.stringify(weeklyPlanner))
    localStorage.setItem(budgetStorageKey, JSON.stringify(budget))
    localStorage.setItem(overridesStorageKey, JSON.stringify(ingredientOverrides))
    localStorage.setItem(customStorageKey, JSON.stringify(customIngredients))
    localStorage.setItem(savedMealsStorageKey, JSON.stringify(savedMeals))
    localStorage.setItem(favoriteMealsStorageKey, JSON.stringify(favoriteMealIds))
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

  const libraryBg = {
    backgroundImage: "url('/meal.webp')",
  }

  if (!isAuthenticated) return <Auth onAuthSuccess={allowAccess} initialMode={authInitialMode} />

  if (page === 'home') {
    return (
      <>
        <Homepage
          onGoProfile={() => navigate('profile')}
          onGoPlanner={() => navigate('planner')}
          onNavigate={navigate}
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
            <Header budget={budget} currentPage="planner" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <WeeklyPlanner
              weeklyPlanner={weeklyPlanner}
              setWeeklyPlanner={setWeeklyPlanner}
              formatKes={formatKes}
              savedMeals={savedMeals}
              onSaveMealToLibrary={saveMealToLibrary}
            />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'library') {
    return (
      <>
        <main className="min-h-screen bg-cover bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={libraryBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header budget={budget} currentPage="library" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <MealLibrary
              mealLibrary={mealLibrary}
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
            <Header budget={budget} currentPage="grocery" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <Grocery
              groceryList={groceryList}
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
            <Header budget={budget} currentPage="budget" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
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
            <Header budget={budget} currentPage="profile" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <Profile
              userProfile={currentUser}
              weeklyTotal={weeklyTotal}
              budget={budget}
              isUnderBudget={isUnderBudget}
              weekRows={weekRows}
              groceryList={groceryList}
              formatKes={formatKes}
              getMealCost={getMealCost}
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
