import {
  Banknote,
  LayoutDashboard,
  ListChecks,
  LogOut,
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
  onLogout,
  sticky = false,
  showSpend = true,
}) {
  const progress = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0
  const overBudget = totalSpent > budget

  return (
    <header
      className={`z-30 overflow-hidden rounded-2xl border border-[#f4a259]/35 bg-gradient-to-r from-[#111111]/86 via-[#1e5948]/82 to-[#0b3e6f]/80 shadow-card backdrop-blur-xl ${
        sticky ? 'sticky top-2' : ''
      }`}
    >
      <div className="absolute inset-y-0 left-0 hidden w-20 md:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/veg.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#111111]/12" />
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2 p-2 md:flex-nowrap md:gap-2.5 md:px-2.5 md:py-2 md:pl-24">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4a259] text-[#111111] shadow-md">
            <div className="flex items-center gap-0.5">
              <UtensilsCrossed size={14} />
              <Banknote size={12} />
            </div>
          </div>
          <h1 className="truncate text-lg font-extrabold tracking-tight text-[#f6efe4] md:text-xl">
            <span className="text-[#4ecb94]">Savvy</span>
            <span className="text-[#f4a259]">spoon</span>
          </h1>
        </div>

        <nav className="order-3 w-full overflow-x-auto scrollbar-hide md:order-2 md:w-auto md:flex-1">
          <div className="flex min-w-max items-center gap-1.5 pr-1 md:justify-center">
          {[
            { id: 'home', label: 'Home', icon: House },
            { id: 'planner', label: 'Weekly Planner', icon: ListChecks },
            { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
            { id: 'budget', label: 'Budget Setting', icon: Banknote },
            { id: 'profile', label: 'Profile', icon: LayoutDashboard },
          ].map((item) => {
            const isActive = currentPage === item.id
            const Icon = item.icon
            return (
              <button
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'border-[#4ecb94]/65 bg-[#1e5948] text-[#050505] shadow-md shadow-[#1e5948]/40'
                    : 'border-[#c86b1a] bg-[#f4a259] text-[#050505] hover:border-[#f4a259] hover:bg-[#f6b06e] hover:shadow-[0_0_16px_rgba(244,162,89,0.45)]'
                }`}
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                type="button"
              >
                <Icon size={14} />
                {item.label}
              </button>
            )
          })}
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-red-300/60 bg-red-500/85 px-2.5 py-1.5 text-xs font-extrabold text-white transition-all duration-200 hover:bg-red-600"
            onClick={() => onLogout?.()}
            type="button"
          >
            <LogOut size={14} />
            Logout
          </button>
          </div>
        </nav>

        {showSpend ? (
          <div className="order-2 w-full rounded-xl border border-[#f4a259]/45 bg-[#111111]/38 px-2.5 py-2 backdrop-blur md:order-3 md:w-auto md:min-w-[205px]">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#f6efe4]/90 md:text-[10px]">
              Weekly Spend
            </p>
            <p className="mt-0.5 text-[11px] text-[#f6efe4] md:text-xs">
              <span className={`font-bold ${overBudget ? 'text-red-400' : 'text-[#4ecb94]'}`}>
                {formatKes(totalSpent)}
              </span>{' '}
              / {formatKes(budget)}
            </p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#f4a259]/25">
              <div
                className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-[#4ecb94]'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p
              className={`mt-1 text-[9px] font-semibold md:text-[10px] ${overBudget ? 'text-red-400' : 'text-[#4ecb94]'}`}
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
