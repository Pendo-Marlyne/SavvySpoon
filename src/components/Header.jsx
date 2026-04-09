import {
  Banknote,
  LayoutDashboard,
  Library,
  ListChecks,
  ShoppingCart,
  House,
  UtensilsCrossed,
} from 'lucide-react'

const formatKes = (value) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(
    Number(value || 0),
  )

function Header({
  totalSpent = 0,
  budget = 12000,
  currentPage,
  onNavigate,
  sticky = true,
  showSpend = true,
}) {
  const progress = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0
  const overBudget = totalSpent > budget

  return (
    <header
      className={`z-40 overflow-hidden rounded-3xl border border-brand-orange/25 bg-brand-orange/20 shadow-card backdrop-blur-xl ${
        sticky ? 'sticky top-3' : ''
      }`}
    >
      <div className="absolute inset-y-0 left-0 hidden w-28 md:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/homemade.webp')" }}
        />
        <div className="absolute inset-0 bg-brand-orange/20 backdrop-blur-md" />
      </div>

      <div className="relative flex flex-nowrap items-center justify-between gap-3 p-3 md:gap-6 md:p-4 md:pl-36">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-[#3D2A22] shadow-md">
            <div className="flex items-center gap-0.5">
              <UtensilsCrossed size={17} />
              <Banknote size={15} />
            </div>
          </div>
          <h1 className="truncate text-xl font-extrabold tracking-tight text-[#3D2A22] md:text-2xl">
            <span className="text-brand-green">Savvy</span>
            <span className="text-[#3D2A22]">spoon</span>
          </h1>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {[
            { id: 'home', label: 'Home', icon: House },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'planner', label: 'Weekly Planner', icon: ListChecks },
            { id: 'library', label: 'Meal Library', icon: Library },
            { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
            { id: 'budget', label: 'Budget Setting', icon: Banknote },
          ].map((item) => {
            const isActive = currentPage === item.id
            const Icon = item.icon
            return (
              <button
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-[#3D2A22] hover:bg-brand-orange/20'
                }`}
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                type="button"
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {showSpend ? (
          <div className="w-[58%] max-w-[420px] min-w-[185px] rounded-2xl border border-brand-orange/25 bg-brand-cream/65 p-2.5 backdrop-blur md:p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3D2A22] md:text-xs">
              Weekly Spend
            </p>
            <p className="mt-1 text-xs text-[#3D2A22] md:text-sm">
              <span className={`font-bold ${overBudget ? 'text-red-600' : 'text-brand-green'}`}>
                {formatKes(totalSpent)}
              </span>{' '}
              / {formatKes(budget)}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-orange/25">
              <div
                className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-brand-green'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p
              className={`mt-1 text-[10px] font-semibold md:text-xs ${overBudget ? 'text-red-600' : 'text-brand-green'}`}
            >
              {overBudget ? 'Over budget' : 'Under budget'}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header
