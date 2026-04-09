import { Library } from 'lucide-react'

function MealLibrary({ mealLibrary }) {
  return (
    <section className="rounded-3xl border border-brand-orange/20 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl animate-fade-up">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-brand-green-dark">
        <Library size={22} />
        Meal Library Page
      </h2>
      <p className="mt-1 text-sm text-[#6B6058]">Saved and reusable meals from your weekly plan.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mealLibrary.length > 0 ? (
          mealLibrary.map((meal) => (
            <article key={meal} className="rounded-2xl border border-brand-orange/20 bg-brand-orange/14 p-5 shadow-sm">
              <p className="text-lg font-extrabold text-[#3D2A22]">{meal}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-[#6B6058]">No meals in library yet. Add meals in Weekly Planner.</p>
        )}
      </div>
    </section>
  )
}

export default MealLibrary
