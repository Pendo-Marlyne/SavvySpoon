function Budget({ budget, weeklyTotal, dayTotals, formatKes, updateBudget }) {
  const spentPercent = budget > 0 ? Math.min((weeklyTotal / budget) * 100, 100) : 0
  const remainingPercent = 100 - spentPercent
  const maxDaily = Math.max(...dayTotals.map((d) => d.total), 1)

  return (
    <section className="rounded-3xl border border-brand-orange/20 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl animate-fade-up">
      <h2 className="text-2xl font-extrabold text-brand-green-dark">Budget Setting Page</h2>
      <p className="mt-1 text-sm text-[#6B6058]">Set weekly limit and view pie + bar analytics.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-brand-orange/20 bg-brand-orange/12 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-[#6B6058]">Budget input</p>
          <input
            className="mt-3 w-full rounded-xl border border-brand-orange/25 bg-brand-cream/65 px-4 py-3 font-semibold text-[#3D2A22] focus:border-brand-green focus:outline-none"
            min="0"
            onChange={(event) => updateBudget(event.target.value)}
            type="number"
            value={budget}
          />
          <p className="mt-2 text-sm text-[#6B6058]">
            Spent: {formatKes(weeklyTotal)} / Budget: {formatKes(budget)}
          </p>
        </article>

        <article className="rounded-2xl border border-brand-orange/20 bg-brand-green/10 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-[#6B6058]">Spend pie chart</p>
          <div className="mt-4 flex items-center gap-5">
            <div
              className="h-36 w-36 rounded-full border border-brand-orange/20"
              style={{
                background: `conic-gradient(#256F5B 0% ${spentPercent}%, #F4A259 ${spentPercent}% 100%)`,
              }}
            />
            <div className="space-y-2 text-sm">
              <p><span className="font-extrabold text-brand-green">Spent:</span> {spentPercent.toFixed(1)}%</p>
              <p><span className="font-extrabold text-brand-orange">Remaining:</span> {remainingPercent.toFixed(1)}%</p>
            </div>
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-brand-orange/20 bg-brand-cream/55 p-5">
        <p className="text-sm font-bold uppercase tracking-wider text-[#6B6058]">Daily bar chart</p>
        <div className="mt-4 grid gap-3">
          {dayTotals.map((row) => (
            <div key={row.day} className="grid grid-cols-[90px_1fr_110px] items-center gap-3">
              <p className="text-sm font-semibold capitalize text-[#3D2A22]">{row.day}</p>
              <div className="h-3 rounded-full bg-brand-orange/20">
                <div className="h-full rounded-full bg-brand-green" style={{ width: `${(row.total / maxDaily) * 100}%` }} />
              </div>
              <p className="text-right text-sm font-bold text-[#3D2A22]">{formatKes(row.total)}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Budget
