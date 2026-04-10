import { ArrowRight, Flame, Library, ListChecks, Sparkles, WalletCards } from 'lucide-react'
import Header from './Header'

function Homepage({ onNavigate, onGoProfile, onGoPlanner, role = 'guest', onCreateAccount }) {
  const exampleSpend = 1380

  return (
    <main
      className="min-h-screen bg-brand-cream bg-fixed px-4 py-8 text-[#3D2A22] md:px-8"
      style={{
        backgroundImage:
          "radial-gradient(1100px 620px at 18% 18%, rgba(244, 162, 89, 0.35), transparent 60%), radial-gradient(1000px 560px at 85% 10%, rgba(37, 111, 91, 0.28), transparent 55%), linear-gradient(rgba(255,246,233,0.92), rgba(255,246,233,0.9)), url('/food.webp')",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          currentPage="home"
          onNavigate={onNavigate}
          sticky={false}
          showSpend={false}
        />

        <section className="relative overflow-hidden rounded-[44px] border border-brand-orange/25 bg-brand-cream/55 shadow-card backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/25 via-brand-cream/25 to-brand-green/20" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/food.webp')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-cream/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">
                <Flame size={14} className="text-brand-orange" />
                Main entry point
              </p>
              <h2 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
                Eat well.
                <span className="block text-brand-green">Spend less.</span>
                <span className="block text-brand-orange">Stress never.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6B6058]">
                All in one meal planner that tracks budget in real time—plan your week, generate a grocery list, and save money effortlessly.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3 text-sm font-extrabold text-brand-cream shadow-sm transition hover:bg-brand-green-dark"
                  onClick={onGoPlanner}
                  type="button"
                >
                  Start planning
                  <ArrowRight size={16} />
                </button>
                {role === 'guest' ? (
                  <button
                    className="rounded-full border border-brand-orange bg-brand-cream/70 px-7 py-3 text-sm font-extrabold text-[#3D2A22] shadow-sm transition hover:bg-brand-orange/15"
                    onClick={onCreateAccount}
                    type="button"
                  >
                    Create account
                  </button>
                ) : (
                  <button
                    className="rounded-full border border-brand-orange bg-brand-cream/70 px-7 py-3 text-sm font-extrabold text-[#3D2A22] shadow-sm transition hover:bg-brand-orange/15"
                    onClick={onGoProfile}
                    type="button"
                  >
                    Open profile
                  </button>
                )}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Real-time', value: 'Budget tracking' },
                  { label: 'Auto', value: 'Grocery list' },
                  { label: 'Library', value: 'Saved meals' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-brand-cream/70 via-brand-cream/45 to-brand-orange/10 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6B6058]">{item.label}</p>
                    <p className="mt-2 text-sm font-extrabold text-[#3D2A22]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto h-[520px] w-full max-w-[560px]">
                {[
                  { cls: 'left-0 top-6 h-44 w-36 rotate-[-6deg]', src: "/meal.webp", motion: 'animate-float-soft delay-1' },
                  { cls: 'right-0 top-10 h-52 w-40 rotate-[7deg]', src: "/food.webp", motion: 'animate-float-soft delay-2' },
                  { cls: 'left-16 bottom-0 h-52 w-44 rotate-[4deg]', src: "/homemade.webp", motion: 'animate-float-soft delay-3' },
                  { cls: 'right-16 bottom-10 h-44 w-36 rotate-[-8deg]', src: "/meal.webp", motion: 'animate-float-soft delay-4' },
                  { cls: 'left-1/2 top-1/2 h-64 w-56 -translate-x-1/2 -translate-y-1/2 rotate-[1deg]', src: "/food.webp", motion: 'animate-float-soft' },
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute ${img.cls} ${img.motion} overflow-hidden rounded-[32px] border border-brand-orange/25 bg-gradient-to-br from-brand-cream/75 via-brand-cream/45 to-brand-orange/10 shadow-lg transition-transform duration-300 hover:scale-[1.03]`}
                  >
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${img.src}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[36px] border border-brand-orange/20 bg-gradient-to-br from-brand-green/10 via-brand-cream/35 to-brand-orange/16 p-7 shadow-card backdrop-blur-xl md:p-9">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-cream/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">
                <Sparkles size={14} className="text-brand-orange" />
                Why Savvyspoon
              </p>
              <h3 className="mt-4 text-3xl font-extrabold leading-tight text-[#3D2A22] md:text-4xl">
                Luxury planning vibes, practical weekly results.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B6058] md:text-base">
                Designed to feel premium—but built to keep your week organized, your grocery list ready, and your budget on track.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Smart budgeting',
                    desc: 'Set a weekly limit and see spend vs budget in real time.',
                    icon: WalletCards,
                    bg: 'from-brand-green/22 via-brand-cream/28 to-brand-orange/10',
                    image: "/food.webp",
                  },
                  {
                    title: 'Auto grocery list',
                    desc: 'Generate a grocery list summary from your weekly plan.',
                    icon: ListChecks,
                    bg: 'from-brand-orange/26 via-brand-cream/28 to-brand-green/10',
                    image: "/meal.webp",
                  },
                  {
                    title: 'Meal library',
                    desc: 'Save meal ideas and reuse them across your weekly plans.',
                    icon: Library,
                    bg: 'from-brand-green/18 via-brand-cream/28 to-brand-orange/18',
                    image: "/homemade.webp",
                  },
                  {
                    title: 'Weekly overview',
                    desc: 'One profile overview that keeps totals, days, and status easy to read.',
                    icon: Flame,
                    bg: 'from-brand-orange/18 via-brand-cream/28 to-brand-green/18',
                    image: "/food.webp",
                  },
                ].map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className={`relative overflow-hidden rounded-[26px] border border-brand-orange/20 bg-gradient-to-br ${card.bg} p-6 shadow-sm`}
                    >
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{ backgroundImage: `url('${card.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                      <div className="flex items-start justify-between gap-4">
                        <div className="relative">
                          <p className="text-lg font-extrabold text-[#3D2A22]">{card.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-[#6B6058]">{card.desc}</p>
                        </div>
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cream/70 text-brand-green shadow-sm">
                          <Icon size={20} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[36px] border border-brand-orange/20 bg-gradient-to-br from-brand-cream/55 via-brand-cream/35 to-brand-green/10 p-7 shadow-card backdrop-blur-xl md:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">Visual teaser</p>
              <h3 className="mt-3 text-2xl font-extrabold text-[#3D2A22]">A day card preview</h3>
              <p className="mt-2 text-sm text-[#6B6058]">
                Guests can preview how planning looks before creating an account.
              </p>

              <div className="mt-5 rounded-[28px] border border-brand-orange/30 bg-gradient-to-br from-brand-orange/22 via-brand-green/12 to-brand-orange/28 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">Monday</p>
                    <p className="mt-1 text-xl font-extrabold text-[#3D2A22]">Weekly Plan</p>
                  </div>
                  <div className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold text-brand-cream">
                    Example: KES {exampleSpend.toLocaleString('en-KE')}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Breakfast', value: 'Oat porridge + fruit' },
                    { label: 'Lunch', value: 'Chicken rice bowl' },
                    { label: 'Dinner', value: 'Beef stew + ugali' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 rounded-2xl bg-brand-orange/22 px-4 py-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">{row.label}</p>
                      <p className="text-sm font-bold text-[#3D2A22]">{row.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-brand-green/18 px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6B6058]">Auto grocery list</p>
                  <p className="mt-1 text-sm font-semibold text-[#3D2A22]">Oats • Milk • Bananas • Chicken • Rice • Tomatoes</p>
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
