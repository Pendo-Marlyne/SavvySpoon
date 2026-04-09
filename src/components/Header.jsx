import {
  Banknote,
  LayoutDashboard,
  ListChecks,
  Salad,
  UserCircle2,
  UtensilsCrossed,
} from 'lucide-react'

const formatKes = (value) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(
    Number(value || 0),
  )

function Header({ totalSpent = 0, budget = 12000, role = 'account', currentPage, onNavigate }) {
  const progress = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0
  const overBudget = totalSpent > budget

  return (
    <header className="sticky top-3 z-40 overflow-hidden rounded-3xl border border-white/35 bg-white/45 shadow-card backdrop-blur-xl">
      <div className="absolute inset-y-0 left-0 hidden w-28 md:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/homemade.webp')" }}
        />
        <div className="absolute inset-0 bg-brand-green/30 backdrop-blur-md" />
      </div>

      <div className="relative flex flex-nowrap items-center justify-between gap-3 p-3 md:gap-6 md:p-4 md:pl-36">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-md">
            <div className="flex items-center gap-0.5">
              <UtensilsCrossed size={17} />
              <Banknote size={15} />
            </div>
          </div>
          <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
            <span className="text-brand-green">Savvy</span>
            <span className="text-brand-orange">spoon</span>
          </h1>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {[
            { id: 'home', label: 'Home', icon: Salad, restricted: false },
            { id: 'planner', label: 'Planner', icon: ListChecks, restricted: false },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, restricted: true },
            { id: 'ingredients', label: 'Ingredients', icon: Salad, restricted: false },
            { id: 'budget', label: 'Budget', icon: Banknote, restricted: false },
            { id: 'profile', label: 'My Profile', icon: UserCircle2, restricted: true },
          ].map((item) => {
            const isActive = currentPage === item.id
            const isBlocked = item.restricted && role === 'guest'
            const Icon = item.icon
            return (
              <button
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white/70 text-brand-green shadow-sm'
                    : isBlocked
                      ? 'text-slate-400'
                      : 'text-slate-800 hover:bg-white/55'
                }`}
                disabled={isBlocked}
                key={item.id}
                onClick={() => onNavigate?.(item.id, { restricted: item.restricted })}
                type="button"
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="w-[58%] max-w-[420px] min-w-[185px] rounded-2xl border border-white/40 bg-white/60 p-2.5 backdrop-blur md:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 md:text-xs">
            Weekly Spend
          </p>
          <p className="mt-1 text-xs text-slate-700 md:text-sm">
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
          <p
            className={`mt-1 text-[10px] font-semibold md:text-xs ${overBudget ? 'text-red-600' : 'text-emerald-600'}`}
          >
            {overBudget ? 'Over budget' : 'Under budget'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
