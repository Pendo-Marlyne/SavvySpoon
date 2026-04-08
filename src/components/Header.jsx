import { Banknote, UtensilsCrossed } from 'lucide-react'

const formatKes = (value) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(
    Number(value || 0),
  )

function Header({ totalSpent = 0, budget = 12000 }) {
  const progress = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0
  const overBudget = totalSpent > budget

  return (
    <header className="sticky top-3 z-40 overflow-hidden rounded-3xl border border-white/35 bg-white/45 shadow-card backdrop-blur-xl">
      <div className="absolute inset-y-0 left-0 hidden w-28 md:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/hot-meal-bg.svg')" }}
        />
        <div className="absolute inset-0 bg-brand-green/30 backdrop-blur-md" />
      </div>

      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:gap-6 md:pl-36">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-md">
            <div className="flex items-center gap-0.5">
              <UtensilsCrossed size={17} />
              <Banknote size={15} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            <span className="text-brand-green">Savvy</span>
            <span className="text-brand-orange">spoon</span>
          </h1>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/60 p-3 backdrop-blur md:w-[360px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Weekly Spend Display</p>
          <p className="mt-1 text-sm text-slate-700">
            <span className={`font-bold ${overBudget ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatKes(totalSpent)}
            </span>{' '}
            / {formatKes(budget)}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={`mt-1 text-xs font-semibold ${overBudget ? 'text-red-600' : 'text-emerald-600'}`}>
            {overBudget ? 'Over budget this week' : 'Under budget this week'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
