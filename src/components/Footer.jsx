function Footer({ onNavigate }) {
  return (
    <footer className="relative mt-10 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0a0a0a] via-[#101010] to-[#1a1a1a] p-6 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/hot-meal-bg.svg')" }} />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-white/85">
            Savvyspoon
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Smart meal planning with cost tracking in Kenyan shillings, plus grocery list generation—built for
            the whole week.
          </p>
          <div className="mt-4 flex items-center gap-3 text-white/80">
            <a className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold transition hover:bg-white/10" href="#">
              Instagram
            </a>
            <a className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold transition hover:bg-white/10" href="#">
              X
            </a>
            <a className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold transition hover:bg-white/10" href="#">
              Facebook
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'home', label: 'Home', restricted: false },
            { id: 'profile', label: 'Profile', restricted: false },
            { id: 'planner', label: 'Weekly Planner', restricted: false },
            { id: 'library', label: 'Meal Library', restricted: false },
            { id: 'grocery', label: 'Grocery List', restricted: false },
            { id: 'budget', label: 'Budget Setting', restricted: false },
          ].map((item) => {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.id)}
                className="text-left text-sm font-semibold text-white/80 transition hover:text-[#f4a259]"
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/55 md:flex md:justify-between">
        <p>© {new Date().getFullYear()} Savvyspoon. All rights reserved.</p>
        <p>Plan • Budget • Grocery</p>
      </div>
    </footer>
  )
}

export default Footer

