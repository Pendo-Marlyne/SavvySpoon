import { Heart } from 'lucide-react'
import { useMemo, useState } from 'react'
import './weeklyplanner.css'

const mealUi = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Supper' },
]

const formatDayLabel = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateKey
  return new Intl.DateTimeFormat('en-KE', { weekday: 'short', month: 'short', day: 'numeric' }).format(date)
}

function WeeklyPlanner({
  weeklyPlanner,
  setWeeklyPlanner,
  savedMeals = [],
  onSaveMealToLibrary,
  weekDates = [],
  weekStartDate,
  onWeekStartDateChange,
  favoriteMealIds = [],
  onToggleFavorite,
  onApplyMealToPlanner,
}) {
  const [activeDay, setActiveDay] = useState(weekDates[0] || '')
  const resolvedActiveDay = weekDates.includes(activeDay) ? activeDay : weekDates[0] || ''

  const updateMealField = (day, mealType, field, value) => {
    setWeeklyPlanner((current) => {
      const next = {
        ...current,
        [day]: {
          ...current[day],
          [mealType]: {
            ...current[day][mealType],
            [field]: value,
          },
        },
      }
      return next
    })
  }

  const activeMeals = weeklyPlanner[resolvedActiveDay]
  const plannedMealCount = useMemo(
    () => mealUi.filter((meal) => (activeMeals?.[meal.key]?.name || '').trim()).length,
    [activeMeals],
  )

  return (
    <section className="weekly-planner-page animate-fade-up">
      <h2
        className="text-3xl font-black text-[#0d2f24]"
        style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}
      >
        Weekly Planner Page
      </h2>
      <p
        className="mt-1 text-base font-black text-[#123c2d]"
        style={{ fontFamily: '"Ink Free", "Segoe UI", "Trebuchet MS", sans-serif' }}
      >
        Main interaction page: choose exact calendar dates, then build Breakfast, Lunch, and Supper for that date.
      </p>
      <div className="mt-3 max-w-xs">
        <label className="block text-xs font-black uppercase tracking-wider text-[#123c2d]">Week start date</label>
        <input
          className="meal-input week-date-input mt-1"
          onChange={(event) => onWeekStartDateChange?.(event.target.value)}
          type="date"
          value={weekStartDate || ''}
        />
      </div>

      <div className="weekly-planner-grid">
        {weekDates.map((day, dayIndex) => {
          const dayPlannedCount = mealUi.filter((meal) => (weeklyPlanner?.[day]?.[meal.key]?.name || '').trim()).length
          const isActive = day === resolvedActiveDay
          return (
            <button
              className={`day-tab-card ${isActive ? 'day-tab-card-active' : ''} delay-${dayIndex % 2 === 0 ? '0' : '1'}`}
              key={day}
              onClick={() => setActiveDay(day)}
              type="button"
            >
              <p className="day-tab-title">{formatDayLabel(day)}</p>
              <p className="day-tab-sub">View and edit meals</p>
              <p className="day-tab-total">{dayPlannedCount} meals planned</p>
            </button>
          )
        })}
      </div>

      <section className="day-detail-panel animate-fade-up delay-1">
        <div className="day-detail-header">
          <div>
            <p className="day-detail-kicker">Selected day</p>
            <h3 className="day-detail-title">{formatDayLabel(resolvedActiveDay)}</h3>
          </div>
          <div className="luxury-cost-circle">
            <span className="luxury-cost-value">{plannedMealCount}</span>
            <span className="luxury-cost-label">Meals Planned</span>
          </div>
        </div>

        <div className="day-meals-grid">
          {mealUi.map((meal) => (
            <div className="meal-block" key={`${resolvedActiveDay}-${meal.key}`}>
              <p className="meal-label">{meal.label}</p>
              <input
                className="meal-input"
                onChange={(event) => updateMealField(resolvedActiveDay, meal.key, 'name', event.target.value)}
                placeholder={`${meal.label} meal`}
                type="text"
                value={activeMeals?.[meal.key]?.name || ''}
              />
              <select
                className="meal-input"
                onChange={(event) => updateMealField(resolvedActiveDay, meal.key, 'name', event.target.value)}
                value=""
              >
                <option value="" disabled>
                  Use from meal library
                </option>
                {savedMeals.map((savedMeal) => (
                  <option key={savedMeal.id} value={savedMeal.name}>
                    {savedMeal.name}
                  </option>
                ))}
              </select>
              <button
                className="meal-input"
                onClick={() => onSaveMealToLibrary?.(activeMeals?.[meal.key]?.name || '')}
                type="button"
              >
                Save meal to library
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="day-detail-panel animate-fade-up delay-1">
        <div className="day-detail-header">
          <div>
            <p className="day-detail-kicker">Meal library</p>
            <h3 className="day-detail-title">Pick and plan instantly</h3>
          </div>
        </div>
        <div className="day-meals-grid">
          {savedMeals.length > 0 ? (
            savedMeals.map((meal) => {
              const isFav = favoriteMealIds.includes(meal.id)
              return (
                <div className="meal-block" key={meal.id}>
                  <p className="meal-label">{meal.name}</p>
                  <div className="flex gap-2">
                    <button
                      className="meal-input"
                      onClick={() => onApplyMealToPlanner?.(meal, resolvedActiveDay, 'breakfast')}
                      type="button"
                    >
                      Plan for Breakfast
                    </button>
                    <button
                      className="meal-input"
                      onClick={() => onApplyMealToPlanner?.(meal, resolvedActiveDay, 'lunch')}
                      type="button"
                    >
                      Plan for Lunch
                    </button>
                    <button
                      className="meal-input"
                      onClick={() => onApplyMealToPlanner?.(meal, resolvedActiveDay, 'dinner')}
                      type="button"
                    >
                      Plan for Supper
                    </button>
                    <button
                      aria-label="Toggle favorite meal"
                      className="meal-input meal-fav-btn"
                      onClick={() => onToggleFavorite?.(meal.id)}
                      type="button"
                    >
                      <Heart fill={isFav ? 'currentColor' : 'none'} size={16} />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="meal-cost">No meals saved yet. Save meals above to build your personal library.</p>
          )}
        </div>
      </section>
    </section>
  )
}

export default WeeklyPlanner
