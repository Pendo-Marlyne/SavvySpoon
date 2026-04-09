import { ArrowRight } from 'lucide-react'
import Header from './Header'

function Homepage({ budget, totalSpent, onGoDashboard, onGoPlanner }) {
  return (
    <main
      className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(247,245,239,0.78), rgba(247,245,239,0.86)), url('/homemade.webp')",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header budget={budget} totalSpent={totalSpent} />

        <section className="relative overflow-hidden rounded-3xl border border-brand-green/20 bg-white/55 p-8 shadow-card backdrop-blur-xl md:p-12">
          <div
            className="absolute inset-0 bg-cover bg-right opacity-25"
            style={{ backgroundImage: "url('/homemade.webp')" }}
          />
          <div className="relative z-10 max-w-2xl space-y-5">
            <p className="inline-flex rounded-full bg-brand-orange/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-green-dark">
              Welcome to Savvyspoon
            </p>
            <h2 className="text-4xl font-extrabold leading-tight text-brand-green-dark md:text-5xl">
              Plan smarter meals, spend better, and stay organized all week.
            </h2>
            <p className="text-base leading-relaxed text-zinc-800/80">
              Savvyspoon combines meal planning, budget tracking in Kenyan shillings, and grocery list
              generation into one interactive app for homes and food lovers.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                onClick={onGoDashboard}
                type="button"
              >
                Open Dashboard
                <ArrowRight size={16} />
              </button>
              <button
                className="rounded-full border border-brand-green/40 bg-white/40 px-5 py-3 text-sm font-semibold text-brand-green-dark backdrop-blur transition hover:bg-white/55"
                onClick={onGoPlanner}
                type="button"
              >
                Start Meal Planner
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Homepage
