import { useEffect, useMemo, useState } from 'react'
import Toast from './Toast'

function Budget({ budget, weeklyTotal, dayTotals, groceryList, formatKes, updateBudget, statusStorageKey = 'savvyspoon.budgetStatus' }) {
  const [dismissedToastKey, setDismissedToastKey] = useState('')

  const spentPercent = budget > 0 ? Math.min((weeklyTotal / budget) * 100, 100) : 0
  const remainingPercent = 100 - spentPercent
  const maxDaily = Math.max(...dayTotals.map((d) => d.total), 1)
  const sortedDays = [...dayTotals].sort((a, b) => b.total - a.total)
  const mostExpensiveDay = sortedDays[0]
  const leastExpensiveDay = sortedDays[sortedDays.length - 1]

  const ingredientSpendRows = useMemo(() => {
    const grouped = (groceryList || []).reduce((acc, item) => {
      const amount = Number(item.price || 0) * Number(item.quantity || 0)
      const name = item.ingredientName || 'Ingredient'
      acc[name] = (acc[name] || 0) + amount
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
  }, [groceryList])

  const maxIngredientSpend = Math.max(...ingredientSpendRows.map((row) => row.total), 1)
  const isOverBudget = weeklyTotal > budget
  const toastTone = isOverBudget ? 'danger' : 'success'
  const toastTitle = isOverBudget ? 'Welcome back! You are over budget' : 'Welcome back! You are under budget'
  const toastMessage = `Live update: ${formatKes(weeklyTotal)} of ${formatKes(budget)} used`
  const toastKey = `${isOverBudget ? 'over' : 'under'}-${budget}-${weeklyTotal}`

  useEffect(() => {
    const status = isOverBudget ? 'over' : 'under'
    const statusPayload = { status, weeklyTotal, budget, updatedAt: Date.now() }
    localStorage.setItem(statusStorageKey, JSON.stringify(statusPayload))
  }, [budget, weeklyTotal, isOverBudget, statusStorageKey])

  return (
    <section className="animate-fade-up p-1">
      <Toast
        message={toastMessage}
        onClose={() => setDismissedToastKey(toastKey)}
        open={dismissedToastKey !== toastKey}
        title={toastTitle}
        tone={toastTone}
      />

      <h2 className="text-3xl font-black tracking-wide text-[#fff6e9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">Budget Setting Page</h2>
      <p className="mt-1 text-sm font-bold text-[#ffd8ad]">Set weekly limit and view pie + bar analytics.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#f4a259]/55 bg-black/55 p-5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.9)]">
          <p className="text-sm font-black uppercase tracking-wider text-[#f4a259]">Budget input</p>
          <input
            className="mt-3 w-full rounded-xl border border-[#1e5948]/70 bg-black/60 px-4 py-3 text-lg font-black text-[#fff6e9] focus:border-[#f4a259] focus:outline-none"
            min="0"
            onChange={(event) => updateBudget(event.target.value)}
            type="number"
            value={budget}
          />
          <p className="mt-2 text-sm font-bold text-[#fff6e9]">
            Spent: {formatKes(weeklyTotal)} / Budget: {formatKes(budget)}
          </p>
        </article>

        <article className="rounded-2xl border border-[#f4a259]/55 bg-black/55 p-5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.9)]">
          <p className="text-sm font-black uppercase tracking-wider text-[#f4a259]">Spend pie chart</p>
          <div className="mt-4 flex items-center gap-5">
            <div
              className="h-40 w-40 rounded-full border-2 border-[#f4a259]/65 shadow-[0_0_22px_rgba(244,162,89,0.35)] transition-transform duration-500 hover:scale-105"
              style={{
                background: `conic-gradient(#256F5B 0% ${spentPercent}%, #F4A259 ${spentPercent}% 100%)`,
              }}
            />
            <div className="space-y-2 text-base font-bold">
              <p>
                <span className="font-black text-[#4ecb94]">Spent:</span>{' '}
                <span className="text-[#fff6e9]">{spentPercent.toFixed(1)}%</span>
              </p>
              <p>
                <span className="font-black text-[#f4a259]">Remaining:</span>{' '}
                <span className="text-[#fff6e9]">{remainingPercent.toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-[#f4a259]/55 bg-black/55 p-5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.9)]">
        <p className="text-sm font-black uppercase tracking-wider text-[#f4a259]">Daily bar chart (most expensive to least)</p>
        <div className="mt-4 grid gap-3">
          {sortedDays.map((row, index) => (
            <div key={row.day} className="grid grid-cols-[90px_1fr_110px] items-center gap-3">
              <p className="text-sm font-black capitalize text-[#fff6e9]">{row.day}</p>
              <div className="h-3 rounded-full bg-[#f4a259]/30">
                <div
                  className="h-full rounded-full bg-[#1e5948] transition-all duration-700"
                  style={{
                    width: `${(row.total / maxDaily) * 100}%`,
                    transitionDelay: `${index * 80}ms`,
                  }}
                />
              </div>
              <p className="text-right text-sm font-black text-[#fff6e9]">{formatKes(row.total)}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#f4a259]/55 bg-black/55 p-5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.9)]">
          <p className="text-sm font-black uppercase tracking-wider text-[#f4a259]">Expensive day summary</p>
          <p className="mt-3 text-lg font-black text-[#fff6e9]">
            Most expensive: <span className="capitalize text-[#f4a259]">{mostExpensiveDay?.day || '-'}</span>
          </p>
          <p className="text-sm font-bold text-[#fff6e9]">{formatKes(mostExpensiveDay?.total || 0)}</p>
          <p className="mt-2 text-sm font-bold text-[#ffd8ad]">
            Least expensive: <span className="capitalize">{leastExpensiveDay?.day || '-'}</span> ({formatKes(leastExpensiveDay?.total || 0)})
          </p>
        </article>

        <article className="rounded-2xl border border-[#f4a259]/55 bg-black/55 p-5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.9)]">
          <p className="text-sm font-black uppercase tracking-wider text-[#f4a259]">Most expensive ingredient to least</p>
          <div className="mt-3 grid gap-2">
            {ingredientSpendRows.slice(0, 6).map((row, index) => (
              <div key={row.name} className="grid grid-cols-[140px_1fr_100px] items-center gap-2">
                <p className="truncate text-sm font-black text-[#fff6e9]">{row.name}</p>
                <div className="h-2.5 rounded-full bg-[#f4a259]/30">
                  <div
                    className="h-full rounded-full bg-[#0b3e6f] transition-all duration-700"
                    style={{
                      width: `${(row.total / maxIngredientSpend) * 100}%`,
                      transitionDelay: `${index * 90}ms`,
                    }}
                  />
                </div>
                <p className="text-right text-xs font-black text-[#fff6e9]">{formatKes(row.total)}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default Budget
