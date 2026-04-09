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

function WeeklyPlanner({ weeklyPlanner, setWeeklyPlanner, formatKes }) {
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
      localStorage.setItem('savvyspoon.weeklyPlan', JSON.stringify(next))
      return next
    })
  }

  return (
    <section className="weekly-planner-page animate-fade-up">
      <h2 className="text-2xl font-bold text-brand-green-dark">Weekly Planner Page</h2>
      <p className="mt-1 text-sm text-[#6B6058]">
        Main interaction page: build your 7-day meal plan with Breakfast, Lunch and Supper.
      </p>

      <div className="weekly-planner-grid">
        {orderedDays.map((day, dayIndex) => {
          const meals = weeklyPlanner[day]
          return (
            <article className={`day-card delay-${dayIndex % 2 === 0 ? '0' : '1'}`} key={day}>
              <h3 className="day-card-title">{day}</h3>
              {mealUi.map((meal) => (
                <div className="meal-block" key={`${day}-${meal.key}`}>
                  <p className="meal-label">{meal.label}</p>
                  <input
                    className="meal-input"
                    onChange={(event) => updateMealField(day, meal.key, 'name', event.target.value)}
                    placeholder={`${meal.label} meal`}
                    type="text"
                    value={meals?.[meal.key]?.name || ''}
                  />
                  <input
                    className="meal-input"
                    min="0"
                    onChange={(event) => updateMealField(day, meal.key, 'cost', event.target.value)}
                    placeholder="Cost in KES"
                    type="number"
                    value={Number(meals?.[meal.key]?.cost || 0)}
                  />
                  <p className="meal-cost">Cost: {formatKes(meals?.[meal.key]?.cost || 0)}</p>
                </div>
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default WeeklyPlanner
