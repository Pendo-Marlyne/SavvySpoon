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
  getMealCostForDay,
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
  const selectedDayTotal = useMemo(
    () =>
      mealUi.reduce(
        (sum, meal) => sum + Number(getMealCostForDay?.(resolvedActiveDay, meal.key) || 0),
        0,
      ),
    [resolvedActiveDay, getMealCostForDay],
  )

  return (
    <section className="weekly-planner-page animate-fade-up">
      <div className="planner-topbar">
        <div>
          <p className="planner-kicker">Savvyspoon Planner</p>
          <h2 className="planner-title">Weekly meal planning</h2>
          <p className="planner-subtitle">
            Select a day, assign meals, and track ingredient-driven meal cost in real time.
          </p>
        </div>
        <div className="planner-date-wrap">
          <label className="planner-date-label">Week start date</label>
          <input
            className="meal-input week-date-input"
            onChange={(event) => onWeekStartDateChange?.(event.target.value)}
            type="date"
            value={weekStartDate || ''}
          />
        </div>
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
              <p className="day-tab-sub">Schedule and costing</p>
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
          <div className="planner-metrics">
            <div className="planner-metric-chip">
              <span className="planner-metric-value">{plannedMealCount}</span>
              <span className="planner-metric-label">Meals planned</span>
            </div>
            <div className="planner-metric-chip">
              <span className="planner-metric-value">KES {selectedDayTotal.toLocaleString('en-KE')}</span>
              <span className="planner-metric-label">Daily total</span>
            </div>
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
              <p className="meal-cost">Meal cost: KES {Number(getMealCostForDay?.(resolvedActiveDay, meal.key) || 0).toLocaleString('en-KE')}</p>
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
