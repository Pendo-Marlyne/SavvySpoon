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
    const items = []
    mealLibrary.forEach((meal) => {
      const words = meal.toLowerCase().split(/[\s&-]+/)
      words.forEach((word) => {
        if (ingredientMap[word]) items.push(ingredientMap[word])
      })
    })
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [mealLibrary])

  const allowAccess = () => {
    setIsAuthenticated(true)
    setPage('home')
  }

  const navigate = (nextPage) => setPage(nextPage)

  const updateBudget = (nextBudget) => {
    const parsed = Number(nextBudget || 0)
    setBudget(parsed)
    localStorage.setItem('savvyspoon.budget', JSON.stringify(parsed))
  }

  const appBg = {
    backgroundImage:
      "linear-gradient(rgba(255,246,233,0.86), rgba(255,246,233,0.9)), url('/food.webp')",
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
        <main className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8" style={appBg}>
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
            <Grocery groceryList={groceryList} />
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
