import { useMemo } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  CookingPot,
  ListChecks,
  ShoppingCart,
} from 'lucide-react'
import Header from './components/Header'
import DashboardCard from './components/DashboardCard'

const defaultPlanner = {
  monday: { breakfast: 6, lunch: 9, dinner: 14 },
  tuesday: { breakfast: 5, lunch: 10, dinner: 13 },
  wednesday: { breakfast: 6, lunch: 8, dinner: 15 },
  thursday: { breakfast: 5, lunch: 9, dinner: 14 },
  friday: { breakfast: 7, lunch: 11, dinner: 16 },
  saturday: { breakfast: 8, lunch: 12, dinner: 18 },
  sunday: { breakfast: 7, lunch: 10, dinner: 17 },
}

const readStoredValue = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const weeklyPlanner = readStoredValue('savvyspoon.weeklyPlan', defaultPlanner)
  const budget = Number(readStoredValue('savvyspoon.budget', 160))

  const { weeklyTotal, isUnderBudget } = useMemo(() => {
    const dayTotals = Object.values(weeklyPlanner).map((day) =>
      Object.values(day).reduce((total, meal) => total + Number(meal || 0), 0),
    )
    const total = dayTotals.reduce((sum, dayTotal) => sum + dayTotal, 0)
    return { weeklyTotal: total, isUnderBudget: total <= budget }
  }, [budget, weeklyPlanner])

  const weekRows = Object.entries(weeklyPlanner)

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-zinc-900 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Header />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Weekly Cost"
            value={`$${weeklyTotal.toFixed(2)}`}
            caption="Auto-calculated from planned meals"
            tone="green"
            icon={CircleDollarSign}
          />
          <DashboardCard
            title="Budget Status"
            value={isUnderBudget ? 'Under Budget' : 'Over Budget'}
            caption={`Weekly budget: $${budget.toFixed(2)}`}
            tone={isUnderBudget ? 'green' : 'orange'}
            icon={ListChecks}
          />
          <DashboardCard
            title="Saved Weekly Plan"
            value={`${weekRows.length} Days`}
            caption="Loaded from localStorage"
            tone="neutral"
            icon={CalendarDays}
          />
          <DashboardCard
            title="Grocery Summary"
            value="42 Ingredients"
            caption="Quick view from last generated list"
            tone="neutral"
            icon={ShoppingCart}
          />
        </section>

        <section className="rounded-3xl border border-brand-green/15 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-brand-green-dark">
              <CookingPot size={22} />
              Weekly Meal Breakdown
            </h2>
            <nav className="flex gap-2 text-sm font-medium">
              <a className="rounded-full bg-brand-green px-4 py-2 text-white" href="#">
                Planner
              </a>
              <a className="rounded-full border border-brand-green/40 px-4 py-2 text-brand-green-dark" href="#">
                Grocery
              </a>
            </nav>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-zinc-500">
                  <th className="px-3 py-2 font-medium">Day</th>
                  <th className="px-3 py-2 font-medium">Breakfast</th>
                  <th className="px-3 py-2 font-medium">Lunch</th>
                  <th className="px-3 py-2 font-medium">Dinner</th>
                  <th className="px-3 py-2 font-medium">Daily Total</th>
                </tr>
              </thead>
              <tbody>
                {weekRows.map(([day, meals]) => {
                  const dailyTotal = Number(meals.breakfast) + Number(meals.lunch) + Number(meals.dinner)
                  return (
                    <tr className="rounded-2xl bg-brand-cream" key={day}>
                      <td className="rounded-l-xl px-3 py-3 font-semibold capitalize text-brand-green-dark">{day}</td>
                      <td className="px-3 py-3">${Number(meals.breakfast).toFixed(2)}</td>
                      <td className="px-3 py-3">${Number(meals.lunch).toFixed(2)}</td>
                      <td className="px-3 py-3">${Number(meals.dinner).toFixed(2)}</td>
                      <td className="rounded-r-xl px-3 py-3 font-semibold text-brand-green-dark">
                        ${dailyTotal.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
