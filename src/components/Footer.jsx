function Footer({ onNavigate, role }) {
  return (
    <footer className="mt-10 rounded-3xl border border-white/35 bg-white/35 p-6 shadow-card backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-600">
            Savvyspoon
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700/90">
            Smart meal planning with cost tracking in Kenyan shillings, plus grocery list generation—built for
            the whole week.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a className="rounded-xl bg-white/55 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white/70" href="#">
              Instagram
            </a>
            <a className="rounded-xl bg-white/55 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white/70" href="#">
              X
            </a>
            <a className="rounded-xl bg-white/55 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white/70" href="#">
              Facebook
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'home', label: 'Home', restricted: false },
            { id: 'planner', label: 'Planner', restricted: false },
            { id: 'dashboard', label: 'Dashboard', restricted: true },
            { id: 'ingredients', label: 'Ingredients', restricted: false },
            { id: 'budget', label: 'Budget', restricted: false },
            { id: 'profile', label: 'My Profile', restricted: true },
          ].map((item) => {
            const disabled = item.restricted && role === 'guest'
            return (
              <button
                key={item.id}
                type="button"
                disabled={disabled}
                onClick={() => onNavigate?.(item.id, { restricted: item.restricted })}
                className={`text-left text-sm font-semibold transition ${
                  disabled
                    ? 'cursor-not-allowed text-slate-400'
                    : 'text-slate-800 hover:text-brand-green-dark'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-white/40 pt-4 text-xs text-slate-600 md:flex md:justify-between">
        <p>© {new Date().getFullYear()} Savvyspoon. All rights reserved.</p>
        <p>Plan • Budget • Grocery</p>
      </div>
    </footer>
  )
}

export default Footer

