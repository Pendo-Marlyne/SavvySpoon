function Footer({ onNavigate }) {
  return (
    <footer className="relative mt-10 overflow-hidden rounded-3xl border border-sky-200/25 bg-gradient-to-br from-sky-900/65 via-sky-800/55 to-indigo-900/60 p-6 shadow-card backdrop-blur-xl">
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url('/hot-meal-bg.svg')" }} />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-100/90">
            Savvyspoon
          </p>
          <p className="mt-3 text-sm leading-relaxed text-sky-100/80">
            Smart meal planning with cost tracking in Kenyan shillings, plus grocery list generation—built for
            the whole week.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a className="rounded-xl bg-sky-100/10 px-3 py-2 text-xs font-bold text-sky-50 transition hover:bg-sky-100/15" href="#">
              Instagram
            </a>
            <a className="rounded-xl bg-sky-100/10 px-3 py-2 text-xs font-bold text-sky-50 transition hover:bg-sky-100/15" href="#">
              X
            </a>
            <a className="rounded-xl bg-sky-100/10 px-3 py-2 text-xs font-bold text-sky-50 transition hover:bg-sky-100/15" href="#">
              Facebook
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'home', label: 'Home', restricted: false },
            { id: 'dashboard', label: 'Dashboard', restricted: false },
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
                className="text-left text-sm font-semibold text-sky-50/90 transition hover:text-amber-200"
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-sky-100/15 pt-4 text-xs text-sky-100/70 md:flex md:justify-between">
        <p>© {new Date().getFullYear()} Savvyspoon. All rights reserved.</p>
        <p>Plan • Budget • Grocery</p>
      </div>
    </footer>
  )
}

export default Footer

