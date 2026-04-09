import Header from '../components/Header'

function WeeklyPlanner({
  budget,
  weeklyTotal,
  weekRows,
  mealTypes,
  getMealName,
  getMealCost,
  updateMealField,
  onNavigate,
}) {
  return (
    <main
      className="min-h-screen bg-brand-cream bg-cover bg-fixed bg-center px-4 py-8 text-[#3D2A22] md:px-8"
      style={{ backgroundImage: "linear-gradient(rgba(255,246,233,0.86), rgba(255,246,233,0.9)), url('/food.webp')" }}
    >
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
        <Header budget={budget} currentPage="planner" onNavigate={onNavigate} showSpend totalSpent={weeklyTotal} />
        <section className="rounded-3xl border border-brand-orange/20 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl animate-fade-up delay-1">
          <h2 className="text-2xl font-bold text-brand-green-dark">Weekly Planner Page</h2>
          <p className="mt-1 text-sm text-[#6B6058]">Assign breakfast, lunch, and dinner for every day.</p>
          <div className="mt-5 space-y-4">
            {weekRows.map(([day, meals]) => (
              <article className="rounded-2xl border border-brand-orange/15 bg-brand-cream/45 p-4" key={day}>
                <h3 className="mb-3 text-base font-semibold capitalize text-brand-green-dark">{day}</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {mealTypes.map((mealType) => (
                    <div className="rounded-xl bg-brand-orange/12 p-3" key={`${day}-${mealType}`}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B6058]">{mealType}</p>
                      <input
                        className="mb-2 w-full rounded-lg border border-brand-orange/20 bg-brand-cream/65 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
                        onChange={(event) => updateMealField(day, mealType, 'name', event.target.value)}
                        placeholder="Meal name"
                        type="text"
                        value={getMealName(meals[mealType])}
                      />
                      <input
                        className="w-full rounded-lg border border-brand-orange/20 bg-brand-cream/65 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
                        min="0"
                        onChange={(event) => updateMealField(day, mealType, 'cost', event.target.value)}
                        placeholder="Cost in KES"
                        type="number"
                        value={getMealCost(meals[mealType])}
                      />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default WeeklyPlanner
