import { useMemo, useState } from 'react'
import './weeklyplanner.css'

const orderedDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const mealUi = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Supper' },
]

function WeeklyPlanner({ weeklyPlanner, setWeeklyPlanner, formatKes, savedMeals = [], onSaveMealToLibrary }) {
  const [activeDay, setActiveDay] = useState('monday')

  const updateMealField = (day, mealType, field, value) => {
    setWeeklyPlanner((current) => {
      const next = {
        ...current,
        [day]: {
          ...current[day],
          [mealType]: {
            ...current[day][mealType],
            [field]: field === 'cost' ? Number(value || 0) : value,
          },
        },
      }
      return next
    })
  }

  const activeMeals = weeklyPlanner[activeDay]
  const activeTotal = useMemo(
    () => mealUi.reduce((sum, meal) => sum + Number(activeMeals?.[meal.key]?.cost || 0), 0),
    [activeMeals],
  )

  return (
    <section className="weekly-planner-page animate-fade-up">
      <h2 className="text-2xl font-bold text-brand-green-dark">Weekly Planner Page</h2>
      <p className="mt-1 text-sm text-[#6B6058]">
        Main interaction page: choose a day card, then build Breakfast, Lunch, and Supper for that day.
      </p>

      <div className="weekly-planner-grid">
        {orderedDays.map((day, dayIndex) => {
          const dayTotal = mealUi.reduce((sum, meal) => sum + Number(weeklyPlanner?.[day]?.[meal.key]?.cost || 0), 0)
          const isActive = day === activeDay
          return (
            <button
              className={`day-tab-card ${isActive ? 'day-tab-card-active' : ''} delay-${dayIndex % 2 === 0 ? '0' : '1'}`}
              key={day}
              onClick={() => setActiveDay(day)}
              type="button"
            >
              <p className="day-tab-title">{day}</p>
              <p className="day-tab-sub">View and edit meals</p>
              <p className="day-tab-total">{formatKes(dayTotal)}</p>
            </button>
          )
        })}
      </div>

      <section className="day-detail-panel animate-fade-up delay-1">
        <div className="day-detail-header">
          <div>
            <p className="day-detail-kicker">Selected day</p>
            <h3 className="day-detail-title">{activeDay}</h3>
          </div>
          <div className="luxury-cost-circle">
            <span className="luxury-cost-value">{formatKes(activeTotal)}</span>
            <span className="luxury-cost-label">Daily Total</span>
          </div>
        </div>

        <div className="day-meals-grid">
          {mealUi.map((meal) => (
            <div className="meal-block" key={`${activeDay}-${meal.key}`}>
              <p className="meal-label">{meal.label}</p>
              <input
                className="meal-input"
                onChange={(event) => updateMealField(activeDay, meal.key, 'name', event.target.value)}
                placeholder={`${meal.label} meal`}
                type="text"
                value={activeMeals?.[meal.key]?.name || ''}
              />
              <select
                className="meal-input"
                onChange={(event) => updateMealField(activeDay, meal.key, 'name', event.target.value)}
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
              <input
                className="meal-input"
                min="0"
                onChange={(event) => updateMealField(activeDay, meal.key, 'cost', event.target.value)}
                placeholder="Cost in KES"
                type="number"
                value={Number(activeMeals?.[meal.key]?.cost || 0)}
              />
              <button
                className="meal-input"
                onClick={() =>
                  onSaveMealToLibrary?.(activeMeals?.[meal.key]?.name || '', activeMeals?.[meal.key]?.cost || 0)
                }
                type="button"
              >
                Save meal to library
              </button>
              <p className="meal-cost">Cost: {formatKes(activeMeals?.[meal.key]?.cost || 0)}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default WeeklyPlanner
