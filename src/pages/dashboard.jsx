import { CalendarDays, CircleDollarSign, CookingPot, ListChecks, ShoppingCart } from 'lucide-react'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'

function Dashboard({
  budget,
  weeklyTotal,
  isUnderBudget,
  weekRows,
  groceryList,
  formatKes,
  getMealCost,
  onNavigate,
}) {
  return (
    <main
      className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8"
      style={{ backgroundImage: "linear-gradient(rgba(255,246,233,0.86), rgba(255,246,233,0.9)), url('/food.webp')" }}
    >
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
        <Header budget={budget} currentPage="dashboard" onNavigate={onNavigate} showSpend totalSpent={weeklyTotal} sticky={false} />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Total Weekly Cost" value={formatKes(weeklyTotal)} caption="Auto-calculated from planned meals (KES)" tone="green" icon={CircleDollarSign} />
          <DashboardCard title="Budget Status" value={isUnderBudget ? 'Under Budget' : 'Over Budget'} caption={`Weekly budget: ${formatKes(budget)}`} tone={isUnderBudget ? 'green' : 'orange'} icon={ListChecks} />
          <DashboardCard title="Saved Weekly Plan" value={`${weekRows.length} Days`} caption="Loaded from localStorage" tone="neutral" icon={CalendarDays} />
          <DashboardCard title="Grocery Items" value={`${groceryList.length} Ingredients`} caption="From auto-generated grocery list" tone="neutral" icon={ShoppingCart} />
        </section>

        <section className="rounded-3xl border border-brand-orange/20 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl animate-fade-up delay-1">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-brand-green-dark">
            <CookingPot size={22} />
            Weekly Meal Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-[#6B6058]">
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
                    <tr className="rounded-2xl bg-brand-orange/10" key={day}>
                      <td className="rounded-l-xl px-3 py-3 font-semibold capitalize text-brand-green-dark">{day}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.breakfast))}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.lunch))}</td>
                      <td className="px-3 py-3">{formatKes(getMealCost(meals.dinner))}</td>
                      <td className="rounded-r-xl px-3 py-3 font-semibold text-brand-green-dark">{formatKes(dailyTotal)}</td>
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

export default Dashboard
