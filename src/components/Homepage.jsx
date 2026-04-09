import { ArrowRight, Banknote, ListChecks, Sparkles } from 'lucide-react'
import Header from './Header'

function Homepage({ budget, totalSpent, role, onNavigate, onGoDashboard, onGoPlanner }) {
  return (
    <main
      className="min-h-screen bg-brand-cream bg-cover bg-center px-4 py-8 text-zinc-900 md:px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(247,245,239,0.78), rgba(247,245,239,0.86)), url('/homemade.webp')",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          budget={budget}
          currentPage="home"
          onNavigate={onNavigate}
          role={role}
          totalSpent={totalSpent}
        />

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[32px] border border-white/45 bg-white/35 p-8 shadow-card backdrop-blur-xl md:p-12">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{ backgroundImage: "url('/homemade.webp')" }}
              />
              <div className="relative z-10">
                <p className="inline-flex items-center gap-2 rounded-full bg-amber-200/35 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-amber-950">
                  <Sparkles size={14} />
                  Smart meal + budget planner
                </p>
                <h2 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
                  Make your week tasty.
                  <span className="block text-brand-green">Keep your spending savvy.</span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-800/80">
                  Build a weekly plan, track costs in KES, and generate a grocery list—without jumping between apps.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-green-dark"
                    onClick={onGoPlanner}
                    type="button"
                  >
                    Start planning
                    <ArrowRight size={16} />
                  </button>
                  <button
                    className="rounded-full border border-white/55 bg-white/35 px-6 py-3 text-sm font-extrabold text-slate-900 backdrop-blur transition hover:bg-white/55"
                    onClick={onGoDashboard}
                    type="button"
                  >
                    View dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/45 bg-white/40 p-6 shadow-card backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-600">Weekly budget</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">
                      <span className="text-brand-orange">KES</span> {Number(budget || 0).toLocaleString('en-KE')}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/90 text-slate-900 shadow-sm">
                    <Banknote size={20} />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/45 bg-white/40 p-6 shadow-card backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-600">Meal planning</p>
                    <p className="mt-2 text-lg font-semibold text-slate-800">
                      Breakfast • Lunch • Dinner
                    </p>
                    <p className="mt-1 text-sm text-slate-700/80">Assign meals per day and price them in KES.</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white shadow-sm">
                    <ListChecks size={20} />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-white/45 bg-white/30 p-6 shadow-card backdrop-blur-xl">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/homemade.webp')" }} />
                <div className="relative">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-600">Grocery list</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-900">Turn plans into ingredients.</p>
                  <p className="mt-1 text-sm text-slate-700/80">Generate a shopping-friendly summary for the week.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Homepage
