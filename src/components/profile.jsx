import { CalendarDays, CircleDollarSign, CookingPot, ListChecks, ShoppingCart, UserCircle2 } from 'lucide-react'
import DashboardCard from './DashboardCard'

function Profile({ userProfile, weeklyTotal, budget, isUnderBudget, weekRows, groceryList, formatKes, getMealCostForDay }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <section
        className="rounded-3xl border border-brand-orange/25 p-6 shadow-card"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,246,233,0.22), rgba(255,246,233,0.2)), url('/homemade.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2
          className="flex items-center gap-2 text-4xl font-black text-[#0d2f24]"
          style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}
        >
          <UserCircle2 size={24} />
          Profile Summary
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-orange/35 bg-black/35 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffd8ad]">Name</p>
            <p className="mt-1 text-2xl font-black text-[#fff6e9]" style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}>
              {userProfile?.name || 'Savvyspoon User'}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-orange/35 bg-black/35 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffd8ad]">Username</p>
            <p className="mt-1 text-2xl font-black text-[#fff6e9]" style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}>
              {userProfile?.username || '-'}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-orange/35 bg-black/35 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffd8ad]">Location</p>
            <p className="mt-1 text-2xl font-black text-[#fff6e9]" style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}>
              {userProfile?.location || 'Kenya'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Weekly Cost" value={formatKes(weeklyTotal)} caption="Auto-calculated from your meals (KES)" tone="green" icon={CircleDollarSign} />
        <DashboardCard title="Budget Status" value={isUnderBudget ? 'Under Budget' : 'Over Budget'} caption={`Weekly budget: ${formatKes(budget)}`} tone={isUnderBudget ? 'green' : 'orange'} icon={ListChecks} />
        <DashboardCard title="Saved Weekly Plan" value={`${weekRows.length} Days`} caption="Loaded from your account storage" tone="neutral" icon={CalendarDays} />
        <DashboardCard title="Grocery Items" value={`${groceryList.length} Ingredients`} caption="From your personalized grocery list" tone="neutral" icon={ShoppingCart} />
      </section>

      <section
        className="rounded-3xl border border-brand-orange/20 p-6 shadow-card animate-fade-up delay-1"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.3)), url('/food.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2
          className="mb-4 flex items-center gap-2 text-3xl font-black text-[#fff6e9]"
          style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}
        >
          <CookingPot size={22} />
          Weekly Meal Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-[#ffd8ad]">
                <th className="px-3 py-2 text-base font-black">Day</th>
                <th className="px-3 py-2 text-base font-black">Breakfast</th>
                <th className="px-3 py-2 text-base font-black">Lunch</th>
                <th className="px-3 py-2 text-base font-black">Dinner</th>
                <th className="px-3 py-2 text-base font-black">Daily Total</th>
              </tr>
            </thead>
            <tbody>
              {weekRows.map(([day]) => {
                const breakfastCost = getMealCostForDay?.(day, 'breakfast') || 0
                const lunchCost = getMealCostForDay?.(day, 'lunch') || 0
                const dinnerCost = getMealCostForDay?.(day, 'dinner') || 0
                const dailyTotal = breakfastCost + lunchCost + dinnerCost
                return (
                  <tr className="rounded-2xl bg-black/35" key={day}>
                    <td className="rounded-l-xl px-3 py-3 text-base font-black capitalize text-[#fff6e9]">{day}</td>
                    <td className="px-3 py-3 text-base font-black text-[#fff6e9]">{formatKes(breakfastCost)}</td>
                    <td className="px-3 py-3 text-base font-black text-[#fff6e9]">{formatKes(lunchCost)}</td>
                    <td className="px-3 py-3 text-base font-black text-[#fff6e9]">{formatKes(dinnerCost)}</td>
                    <td className="rounded-r-xl px-3 py-3 text-base font-black text-[#4ecb94]">{formatKes(dailyTotal)}</td>
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
