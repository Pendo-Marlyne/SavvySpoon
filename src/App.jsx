import { useMemo, useState } from 'react'
import Header from './components/Header'
import Auth from './components/Auth'
import Homepage from './components/Homepage'
import Footer from './components/Footer'
import Dashboard from './components/dashboard'
import WeeklyPlanner from './components/weeklyplanner'
import MealLibrary from './components/meallibrary'
import Grocery from './components/grocery'
import Budget from './components/budget'
import {
  defaultPlanner,
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
  const [role, setRole] = useState('guest')
  const [ingredientOverrides, setIngredientOverrides] = useState(() =>
    readStoredValue('savvyspoon.ingredientOverrides', {}),
  )
  const [weeklyPlanner, setWeeklyPlanner] = useState(() =>
    normalizePlanner(readStoredValue('savvyspoon.weeklyPlan', defaultPlanner)),
  )
  const [budget, setBudget] = useState(() => Number(readStoredValue('savvyspoon.budget', 12000)))

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

  const mealLibrary = useMemo(() => {
    const names = weekRows.flatMap(([, meals]) => mealTypes.map((type) => getMealName(meals[type]).trim()))
    return [...new Set(names.filter(Boolean))]
  }, [weekRows])

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

    return Object.values(groupedByMealIngredient)
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
      .sort((a, b) => a.mealName.localeCompare(b.mealName))
  }, [weeklyPlanner, ingredientOverrides])

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
      const next = { ...current, [id]: nextForId }
      localStorage.setItem('savvyspoon.ingredientOverrides', JSON.stringify(next))
      return next
    })
  }

  const deleteIngredientRow = (id) => {
    setIngredientOverrides((current) => {
      const previous = current[id] || {}
      const next = { ...current, [id]: { ...previous, deleted: true } }
      localStorage.setItem('savvyspoon.ingredientOverrides', JSON.stringify(next))
      return next
    })
  }

  const allowAccess = (authData) => {
    setIsAuthenticated(true)
    setRole(authData?.role === 'account' ? 'account' : 'guest')
    setPage('home')
  }

  const navigate = (nextPage) => {
    if (role === 'guest' && nextPage !== 'home') return
    setPage(nextPage)
  }

  const updateBudget = (nextBudget) => {
    const parsed = Number(nextBudget || 0)
    setBudget(parsed)
    localStorage.setItem('savvyspoon.budget', JSON.stringify(parsed))
  }

  const appBg = {
    backgroundImage:
      "linear-gradient(rgba(255,246,233,0.86), rgba(255,246,233,0.9)), url('/food.webp')",
  }

  const plannerBg = {
    backgroundImage: "url('/spicy.jpg')",
  }

  if (!isAuthenticated) return <Auth onAuthSuccess={allowAccess} />

  if (page === 'home') {
    return (
      <>
        <Homepage onGoDashboard={() => navigate('dashboard')} onGoPlanner={() => navigate('planner')} onNavigate={navigate} />
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
            <WeeklyPlanner weeklyPlanner={weeklyPlanner} setWeeklyPlanner={setWeeklyPlanner} formatKes={formatKes} />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  if (page === 'library') {
    return (
      <>
        <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header budget={budget} currentPage="library" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <MealLibrary mealLibrary={mealLibrary} />
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
        <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
          <div className="mx-auto max-w-6xl space-y-6">
            <Header budget={budget} currentPage="budget" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
            <Budget budget={budget} weeklyTotal={weeklyTotal} dayTotals={dayTotals} formatKes={formatKes} updateBudget={updateBudget} />
          </div>
        </main>
        <Footer onNavigate={navigate} />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
        <div className="mx-auto max-w-6xl space-y-6">
          <Header budget={budget} currentPage="dashboard" onNavigate={navigate} showSpend totalSpent={weeklyTotal} />
          <Dashboard
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

export default App
