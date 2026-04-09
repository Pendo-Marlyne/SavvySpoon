import { useMemo, useState } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  CookingPot,
  ListChecks,
  ShoppingCart,
} from 'lucide-react'
import Header from './components/Header'
import DashboardCard from './components/DashboardCard'
import Auth from './components/Auth'
import Homepage from './components/Homepage'
import Toast from './components/Toast'
import Footer from './components/Footer'

const defaultPlanner = {
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

const readStoredValue = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const mealTypes = ['breakfast', 'lunch', 'dinner']

const normalizePlanner = (planner) => {
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

const getMealCost = (meal) => Number((typeof meal === 'number' ? meal : meal?.cost) || 0)
const getMealName = (meal) => (typeof meal === 'number' ? '' : meal?.name || '')

function App() {
  const [page, setPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState('guest')
  const [toast, setToast] = useState({ open: false, title: '', message: '', tone: 'warning' })
  const [weeklyPlanner, setWeeklyPlanner] = useState(() =>
    normalizePlanner(readStoredValue('savvyspoon.weeklyPlan', defaultPlanner)),
  )
  const budget = Number(readStoredValue('savvyspoon.budget', 12000))
  const formatKes = (value) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(
      Number(value || 0),
    )

  const { weeklyTotal, isUnderBudget } = useMemo(() => {
    const dayTotals = Object.values(weeklyPlanner).map((day) =>
      Object.values(day).reduce((total, meal) => total + getMealCost(meal), 0),
    )
    const total = dayTotals.reduce((sum, dayTotal) => sum + dayTotal, 0)
    return { weeklyTotal: total, isUnderBudget: total <= budget }
  }, [budget, weeklyPlanner])

  const weekRows = Object.entries(weeklyPlanner)
  const allowAccess = ({ role: nextRole } = {}) => {
    setIsAuthenticated(true)
    setRole(nextRole || 'guest')
    setPage('home')
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={allowAccess} />
  }

  const showToast = (next) => {
    setToast({ open: true, tone: 'warning', ...next })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 3500)
  }

  const navigate = (nextPage, meta = {}) => {
    const restricted = meta.restricted === true
    if (restricted && role === 'guest') {
      showToast({
        title: 'Account required',
        message: 'Please sign in or create an account to access this page.',
        tone: 'warning',
      })
      return
    }
    setPage(nextPage)
  }

  const updateMealField = (day, mealType, field, value) => {
    setWeeklyPlanner((current) => {
      const next = {
        ...current,
        [day]: {
          ...current[day],
          [mealType]: {
            ...current[day][mealType],
            [field]: field === 'cost' ? Number(value || 0) : value,
          },
        },
      }
      localStorage.setItem('savvyspoon.weeklyPlan', JSON.stringify(next))
      return next
    })
  }

  if (page === 'home') {
    return (
      <>
        <Toast
          message={toast.message}
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          open={toast.open}
          title={toast.title}
          tone={toast.tone}
        />
        <Homepage
          budget={budget}
          onGoDashboard={() => navigate('dashboard', { restricted: true })}
          onGoPlanner={() => navigate('planner')}
          onNavigate={navigate}
          role={role}
          totalSpent={weeklyTotal}
        />
        <Footer onNavigate={navigate} role={role} />
      </>
    )
  }

  if (page === 'planner') {
    return (
      <>
        <main
          className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,245,239,0.86), rgba(247,245,239,0.9)), url('/homemade.webp')",
          }}
        >
          <div className="mx-auto max-w-6xl space-y-6">
          <Toast
            message={toast.message}
            onClose={() => setToast((current) => ({ ...current, open: false }))}
            open={toast.open}
            title={toast.title}
            tone={toast.tone}
          />
          <Header budget={budget} currentPage="planner" onNavigate={navigate} role={role} totalSpent={weeklyTotal} />
          <section className="rounded-3xl border border-brand-green/15 bg-white p-6 shadow-card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-brand-green-dark">Weekly Meal Planner</h2>
                <p className="text-sm text-zinc-600">
                  Assign a meal and cost to each day for breakfast, lunch, and dinner.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-brand-green/40 px-4 py-2 text-sm font-semibold text-brand-green-dark"
                  onClick={() => navigate('home')}
                  type="button"
                >
                  Home
                </button>
                <button
                  className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => navigate('dashboard', { restricted: true })}
                  type="button"
                >
                  Dashboard
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {weekRows.map(([day, meals]) => (
                <article className="rounded-2xl border border-zinc-200 p-4" key={day}>
                  <h3 className="mb-3 text-base font-semibold capitalize text-brand-green-dark">{day}</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {mealTypes.map((mealType) => (
                      <div className="rounded-xl bg-brand-cream p-3" key={`${day}-${mealType}`}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">{mealType}</p>
                        <input
                          className="mb-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
                          onChange={(event) => updateMealField(day, mealType, 'name', event.target.value)}
                          placeholder="Meal name"
                          type="text"
                          value={getMealName(meals[mealType])}
                        />
                        <input
                          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
                          min="0"
                          onChange={(event) => updateMealField(day, mealType, 'cost', event.target.value)}
                          placeholder="Cost in KES"
                          type="number"
                          value={getMealCost(meals[mealType])}
                        />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
          </div>
        </main>
        <Footer onNavigate={navigate} role={role} />
      </>
    )
  }

  if (page === 'ingredients') {
    return (
      <>
        <main
        className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(247,245,239,0.86), rgba(247,245,239,0.9)), url('/homemade.webp')",
        }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <Toast
            message={toast.message}
            onClose={() => setToast((current) => ({ ...current, open: false }))}
            open={toast.open}
            title={toast.title}
            tone={toast.tone}
          />
          <Header budget={budget} currentPage="ingredients" onNavigate={navigate} role={role} totalSpent={weeklyTotal} />
          <section className="rounded-3xl border border-brand-green/15 bg-white/65 p-6 shadow-card backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-slate-900">Ingredient List</h2>
            <p className="mt-2 text-sm text-slate-700/80">
              This page will summarize ingredients generated from your weekly plan.
            </p>
          </section>
        </div>
      </main>
        <Footer onNavigate={navigate} role={role} />
      </>
    )
  }

  if (page === 'budget') {
    return (
      <>
        <main
        className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(247,245,239,0.86), rgba(247,245,239,0.9)), url('/homemade.webp')",
        }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <Toast
            message={toast.message}
            onClose={() => setToast((current) => ({ ...current, open: false }))}
            open={toast.open}
            title={toast.title}
            tone={toast.tone}
          />
          <Header budget={budget} currentPage="budget" onNavigate={navigate} role={role} totalSpent={weeklyTotal} />
          <section className="rounded-3xl border border-brand-green/15 bg-white/65 p-6 shadow-card backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-slate-900">Budget</h2>
            <p className="mt-2 text-sm text-slate-700/80">
              This page will let you set and update your weekly budget in KES.
            </p>
          </section>
        </div>
      </main>
        <Footer onNavigate={navigate} role={role} />
      </>
    )
  }

  if (page === 'profile') {
    return (
      <>
        <main
        className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(247,245,239,0.86), rgba(247,245,239,0.9)), url('/homemade.webp')",
        }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <Toast
            message={toast.message}
            onClose={() => setToast((current) => ({ ...current, open: false }))}
            open={toast.open}
            title={toast.title}
            tone={toast.tone}
          />
          <Header budget={budget} currentPage="profile" onNavigate={navigate} role={role} totalSpent={weeklyTotal} />
          <section className="rounded-3xl border border-brand-green/15 bg-white/65 p-6 shadow-card backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-slate-900">My Profile</h2>
            <p className="mt-2 text-sm text-slate-700/80">
              Account-only page. It will show personal details and saved preferences.
            </p>
          </section>
        </div>
      </main>
        <Footer onNavigate={navigate} role={role} />
      </>
    )
  }

  return (
    <>
      <main
        className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-zinc-900 md:px-8"
        style={{ backgroundImage: "linear-gradient(rgba(247,245,239,0.86), rgba(247,245,239,0.9)), url('/homemade.webp')" }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
        <Toast
          message={toast.message}
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          open={toast.open}
          title={toast.title}
          tone={toast.tone}
        />
        <Header budget={budget} currentPage="dashboard" onNavigate={navigate} role={role} totalSpent={weeklyTotal} />
        <div className="flex justify-end">
          <button
            className="rounded-full border border-brand-green/35 bg-white px-4 py-2 text-sm font-semibold text-brand-green-dark"
            onClick={() => navigate('home')}
            type="button"
          >
            Back to Home
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Weekly Cost"
            value={formatKes(weeklyTotal)}
            caption="Auto-calculated from planned meals (KES)"
            tone="green"
            icon={CircleDollarSign}
          />
          <DashboardCard
            title="Budget Status"
            value={isUnderBudget ? 'Under Budget' : 'Over Budget'}
            caption={`Weekly budget: ${formatKes(budget)}`}
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
              <button
                className="rounded-full bg-brand-green px-4 py-2 text-white"
                onClick={() => navigate('planner')}
                type="button"
              >
                Planner
              </button>
              <button className="rounded-full border border-brand-green/40 px-4 py-2 text-brand-green-dark" type="button">
                Grocery
              </button>
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
                  const dailyTotal = getMealCost(meals.breakfast) + getMealCost(meals.lunch) + getMealCost(meals.dinner)
                  return (
                    <tr className="rounded-2xl bg-brand-cream" key={day}>
                      <td className="rounded-l-xl px-3 py-3 font-semibold capitalize text-brand-green-dark">{day}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.breakfast))}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.lunch))}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.dinner))}</td>
                      <td className="rounded-r-xl px-3 py-3 font-semibold text-brand-green-dark">
                        {formatKes(dailyTotal)}
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
      <Footer onNavigate={navigate} role={role} />
    </>
  )

}

export default App
