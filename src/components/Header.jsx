import { WalletCards } from 'lucide-react'

function LogoMark() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green shadow-card">
      <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-brand-orange" />
      <WalletCards size={22} className="text-white" />
    </div>
  )
}

function Header() {
  return (
    <header className="rounded-3xl border border-brand-green/15 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <LogoMark />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Smart Meal + Budget Planner
            </p>
            <h1 className="text-3xl font-bold text-brand-green-dark">Savvyspoon Dashboard</h1>
          </div>
        </div>
        <p className="max-w-xl text-sm text-zinc-600">
          Plan weekly breakfast, lunch, and dinner, track total cost vs budget, and jump into grocery
          list generation in one interactive home screen.
        </p>
      </div>
    </header>
  )
}

export default Header
