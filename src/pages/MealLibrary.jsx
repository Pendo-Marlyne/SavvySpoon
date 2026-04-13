import { Heart, Library } from 'lucide-react'
import { useState } from 'react'

const mealTypes = ['breakfast', 'lunch', 'dinner']
const formatDayLabel = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateKey
  return new Intl.DateTimeFormat('en-KE', { weekday: 'short', month: 'short', day: 'numeric' }).format(date)
}

function MealLibrary({
  mealLibrary,
  favoriteMealIds = [],
  onToggleFavorite,
  onApplyMealToPlanner,
  plannerDayOptions = [],
}) {
  const [selectionByMeal, setSelectionByMeal] = useState({})

  const getSelection = (mealId) =>
    selectionByMeal[mealId] || {
      day: plannerDayOptions[0] || '',
      mealType: 'breakfast',
    }

  return (
    <section className="rounded-3xl border border-brand-orange/30 bg-black/40 p-6 shadow-card animate-fade-up">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-brand-cream">
        <Library size={22} />
        Meal Library Page
      </h2>
      <p className="mt-1 text-sm font-semibold text-[#ffd8ad]">
        Saved meals only appear here when you click "Save meal to library" in Weekly Planner.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mealLibrary.length > 0 ? (
          mealLibrary.map((meal) => (
            <article key={meal.id} className="rounded-2xl border border-brand-orange/35 bg-black/65 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-extrabold text-[#fff6e9]">{meal.name}</p>
                <button
                  className={`rounded-full p-1.5 ${
                    favoriteMealIds.includes(meal.id)
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-brand-orange/20 text-brand-orange'
                  }`}
                  onClick={() => onToggleFavorite?.(meal.id)}
                  type="button"
                >
                  <Heart fill={favoriteMealIds.includes(meal.id) ? 'currentColor' : 'none'} size={16} />
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#ffd8ad]">Default cost: KES {Number(meal.defaultCost || 0)}</p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <select
                  className="rounded-lg border border-brand-orange/40 bg-black/55 px-2 py-2 text-sm font-bold text-brand-cream outline-none"
                  onChange={(event) =>
                    setSelectionByMeal((current) => ({
                      ...current,
                      [meal.id]: { ...getSelection(meal.id), day: event.target.value },
                    }))
                  }
                  value={getSelection(meal.id).day}
                >
                  {plannerDayOptions.map((day) => (
                    <option key={day} value={day}>
                      {formatDayLabel(day)}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-brand-orange/40 bg-black/55 px-2 py-2 text-sm font-bold text-brand-cream outline-none"
                  onChange={(event) =>
                    setSelectionByMeal((current) => ({
                      ...current,
                      [meal.id]: { ...getSelection(meal.id), mealType: event.target.value },
                    }))
                  }
                  value={getSelection(meal.id).mealType}
                >
                  {mealTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="mt-3 w-full rounded-lg border border-brand-orange/45 bg-brand-orange/20 px-3 py-2 text-sm font-black text-brand-cream transition hover:bg-brand-orange/35"
                onClick={() => onApplyMealToPlanner?.(meal, getSelection(meal.id).day, getSelection(meal.id).mealType)}
                type="button"
              >
                Add to weekly planner
              </button>
            </article>
          ))
        ) : (
          <p className="text-sm font-semibold text-[#ffd8ad]">No meals in library yet. Save meals from Weekly Planner.</p>
        )}
      </div>
    </section>
  )
}

export default MealLibrary
