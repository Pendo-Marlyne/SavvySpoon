import { CalendarDays, CircleDollarSign, CookingPot, ListChecks, ShoppingCart, UserCircle2 } from 'lucide-react'
import DashboardCard from './DashboardCard'

function Profile({ userProfile, weeklyTotal, budget, isUnderBudget, weekRows, groceryList, formatKes, getMealCost }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <section className="rounded-3xl border border-brand-orange/25 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-brand-green-dark">
          <UserCircle2 size={24} />
          Profile Summary
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/10 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6B6058]">Name</p>
            <p className="mt-1 text-base font-extrabold text-[#3D2A22]">{userProfile?.name || 'Savvyspoon User'}</p>
          </div>
          <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/10 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6B6058]">Username</p>
            <p className="mt-1 text-base font-extrabold text-[#3D2A22]">{userProfile?.username || '-'}</p>
          </div>
          <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/10 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6B6058]">Location</p>
            <p className="mt-1 text-base font-extrabold text-[#3D2A22]">{userProfile?.location || 'Kenya'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Weekly Cost" value={formatKes(weeklyTotal)} caption="Auto-calculated from your meals (KES)" tone="green" icon={CircleDollarSign} />
        <DashboardCard title="Budget Status" value={isUnderBudget ? 'Under Budget' : 'Over Budget'} caption={`Weekly budget: ${formatKes(budget)}`} tone={isUnderBudget ? 'green' : 'orange'} icon={ListChecks} />
        <DashboardCard title="Saved Weekly Plan" value={`${weekRows.length} Days`} caption="Loaded from your account storage" tone="neutral" icon={CalendarDays} />
        <DashboardCard title="Grocery Items" value={`${groceryList.length} Ingredients`} caption="From your personalized grocery list" tone="neutral" icon={ShoppingCart} />
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
  )
}

export default Profile
