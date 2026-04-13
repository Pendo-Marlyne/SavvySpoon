import { CircleDollarSign, PackagePlus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'

const mealImages = ['/meal.webp', '/food.webp', '/homemade.webp', '/spicy.jpg']
const unitOptions = ['pcs', 'kg', 'loaves', 'ltrs', 'egg']
const mealTypeOptions = ['breakfast', 'lunch', 'dinner']

function Grocery({ groceryList, weekDates = [], formatKes, onDeleteIngredient, onUpdateIngredient, onAddIngredient }) {
  const groceryTotal = groceryList.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)

  const [newItem, setNewItem] = useState({
    ingredientName: '',
    day: weekDates[0] || '',
    mealType: 'breakfast',
    mealName: '',
    quantity: 1,
    unit: 'pcs',
    price: 0,
  })

  const handleAddIngredient = () => {
    if (!newItem.ingredientName.trim()) return
    onAddIngredient?.(newItem)
    setNewItem({
      ingredientName: '',
      day: weekDates[0] || '',
      mealType: 'breakfast',
      mealName: '',
      quantity: 1,
      unit: 'pcs',
      price: 0,
    })
  }

  return (
    <section
      className="animate-fade-up rounded-[2rem] border border-[#f4a259]/45 bg-black/28 p-6 shadow-card"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.26), rgba(0,0,0,0.22)), url('/spicy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="rounded-2xl border border-[#f4a259]/45 bg-white/72 px-4 py-4 shadow-[inset_0_0_24px_rgba(244,162,89,0.12)] backdrop-blur">
        <h2 className="flex items-center justify-center gap-2 text-center text-3xl font-black tracking-wide text-[#3D2A22]">
          <ShoppingCart size={24} />
          INGREDIENT MENU
        </h2>
        <div className="mx-auto mt-2 h-[2px] w-44 bg-gradient-to-r from-transparent via-[#f4a259] to-transparent" />
      </div>
      <p className="mt-4 text-center text-sm font-bold text-[#3D2A22]">
        Edit ingredient quantities, choose units (pcs, kg, loaves, ltrs, egg), set prices, and delete meal-specific rows.
      </p>
      <div className="mt-4 grid gap-3 rounded-2xl border border-[#f4a259]/55 bg-black/78 p-4 md:grid-cols-7">
        <input
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          onChange={(event) => setNewItem((current) => ({ ...current, ingredientName: event.target.value }))}
          placeholder="Add new ingredient"
          type="text"
          value={newItem.ingredientName}
        />
        <input
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          onChange={(event) => setNewItem((current) => ({ ...current, mealName: event.target.value }))}
          placeholder="Meal (optional)"
          type="text"
          value={newItem.mealName}
        />
        <select
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          onChange={(event) => setNewItem((current) => ({ ...current, day: event.target.value }))}
          value={newItem.day}
        >
          {weekDates.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          onChange={(event) => setNewItem((current) => ({ ...current, mealType: event.target.value }))}
          value={newItem.mealType}
        >
          {mealTypeOptions.map((mealType) => (
            <option key={mealType} value={mealType}>
              {mealType}
            </option>
          ))}
        </select>
        <input
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          min="0"
          onChange={(event) => setNewItem((current) => ({ ...current, quantity: Number(event.target.value || 0) }))}
          step="0.5"
          type="number"
          value={newItem.quantity}
        />
        <select
          className="rounded-lg border border-[#f4a259]/60 bg-[#fff6e9]/90 px-3 py-2 text-sm font-black text-[#3D2A22] outline-none focus:border-[#f4a259]"
          onChange={(event) => setNewItem((current) => ({ ...current, unit: event.target.value }))}
          value={newItem.unit}
        >
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg border border-[#f4a259]/80 bg-black/90 px-3 py-2 text-sm font-black uppercase tracking-wide text-[#fff6e9] transition hover:bg-black"
          onClick={handleAddIngredient}
          type="button"
        >
          Add Ingredient
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {groceryList.length > 0 ? (
          groceryList.map((item, index) => (
            <article
              key={item.id}
              className="animate-fade-up rounded-2xl border border-[#f4a259]/50 bg-black/84 p-4 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(244,162,89,0.3)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#f4a259]/25 pb-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_0_12px_rgba(244,162,89,0.25)]">
                    <img
                      alt={item.ingredientName}
                      className="h-full w-full object-cover"
                      src={mealImages[index % mealImages.length]}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black tracking-tight text-[#fff6e9]">{item.ingredientName}</p>
                    <p className="truncate text-sm font-extrabold uppercase tracking-wide text-[#f4a259]">{item.mealName}</p>
                    <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#ffd8ad]">
                      {item.day || '-'} • {item.mealType || 'unassigned'}
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-full border border-red-300/70 bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/35"
                  onClick={() => onDeleteIngredient?.(item.id)}
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                <label className="rounded-xl border border-[#1e5948]/65 bg-black/55 px-3 py-2">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#f4a259]">Day</span>
                  <select
                    className="w-full rounded-lg border border-[#1e5948]/65 bg-black/65 px-2 py-1.5 text-sm font-black text-[#fff6e9] outline-none focus:border-[#f4a259]"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'day', event.target.value)}
                    value={item.day || ''}
                  >
                    {weekDates.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-xl border border-[#1e5948]/65 bg-black/55 px-3 py-2">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#f4a259]">Meal type</span>
                  <select
                    className="w-full rounded-lg border border-[#1e5948]/65 bg-black/65 px-2 py-1.5 text-sm font-black text-[#fff6e9] outline-none focus:border-[#f4a259]"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'mealType', event.target.value)}
                    value={item.mealType || 'breakfast'}
                  >
                    {mealTypeOptions.map((mealType) => (
                      <option key={mealType} value={mealType}>
                        {mealType}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-xl border border-[#1e5948]/65 bg-black/55 px-3 py-2">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#f4a259]">
                    <PackagePlus size={12} />
                    Quantity Needed
                  </span>
                  <input
                    className="w-full rounded-lg border border-[#1e5948]/65 bg-black/65 px-2 py-1.5 text-sm font-black text-[#fff6e9] outline-none focus:border-[#f4a259]"
                    min="0"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'quantity', event.target.value)}
                    step="0.5"
                    type="number"
                    value={item.quantity}
                  />
                </label>

                <label className="rounded-xl border border-[#1e5948]/65 bg-black/55 px-3 py-2">
                  <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#f4a259]">Unit</span>
                  <select
                    className="w-full rounded-lg border border-[#1e5948]/65 bg-black/65 px-2 py-1.5 text-sm font-black text-[#fff6e9] outline-none focus:border-[#f4a259]"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'unit', event.target.value)}
                    value={item.unit}
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-xl border border-[#1e5948]/65 bg-black/55 px-3 py-2">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#f4a259]">
                    <CircleDollarSign size={12} />
                    Price (KES)
                  </span>
                  <input
                    className="w-full rounded-lg border border-[#1e5948]/65 bg-black/65 px-2 py-1.5 text-sm font-black text-[#fff6e9] outline-none focus:border-[#f4a259]"
                    min="0"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'price', event.target.value)}
                    step="10"
                    type="number"
                    value={item.price}
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-[#f4a259]/55 bg-[#f4a259]/16 px-3 py-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#fff6e9]">Auto count: x{item.count}</span>
                <span className="text-base font-black text-[#fff6e9]">{formatKes?.(item.price * item.quantity || 0)}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm font-semibold text-brand-cream">
            No ingredients yet. Add meal names in Weekly Planner.
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 border-[#f4a259]/80 bg-black/80 shadow-[0_0_28px_rgba(244,162,89,0.45)]">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#ffd8ad]">Grocery Total</p>
          <p className="mt-1 text-center text-lg font-black text-[#fff6e9]">{formatKes?.(groceryTotal)}</p>
        </div>
      </div>
    </section>
  )
}

export default Grocery
