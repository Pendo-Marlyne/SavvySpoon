import { CircleDollarSign, PackagePlus, ShoppingCart, Trash2 } from 'lucide-react'

const mealImages = ['/meal.webp', '/food.webp', '/homemade.webp', '/spicy.jpg']

function Grocery({ groceryList, formatKes, onDeleteIngredient, onUpdateIngredient }) {
  return (
    <section
      className="animate-fade-up rounded-3xl border border-brand-orange/35 bg-black/45 p-6 shadow-card backdrop-blur-md"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.42)), url('/spicy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-brand-cream">
        <ShoppingCart size={22} />
        Ingredients & Cost Page
      </h2>
      <p className="mt-1 text-sm font-semibold text-brand-orange">
        Edit ingredient quantities, choose units (pcs/kg), set prices, and delete meal-specific rows.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {groceryList.length > 0 ? (
          groceryList.map((item, index) => (
            <article
              key={item.id}
              className="animate-fade-up rounded-2xl border border-brand-orange/45 bg-black/50 p-4 shadow-[0_10px_26px_-16px_rgba(0,0,0,0.85)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-brand-orange/70">
                    <img
                      alt={item.ingredientName}
                      className="h-full w-full object-cover"
                      src={mealImages[index % mealImages.length]}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black tracking-tight text-brand-cream">{item.ingredientName}</p>
                    <p className="truncate text-sm font-bold text-brand-orange">{item.mealName}</p>
                  </div>
                </div>
                <button
                  className="rounded-full border border-red-300/60 bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/35"
                  onClick={() => onDeleteIngredient?.(item.id)}
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="rounded-xl border border-brand-green/50 bg-black/35 px-3 py-2">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-orange">
                    <PackagePlus size={12} />
                    Quantity Needed
                  </span>
                  <input
                    className="w-full rounded-lg border border-brand-green/55 bg-black/55 px-2 py-1.5 text-sm font-extrabold text-brand-cream outline-none focus:border-brand-orange"
                    min="0"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'quantity', event.target.value)}
                    step="0.5"
                    type="number"
                    value={item.quantity}
                  />
                </label>

                <label className="rounded-xl border border-brand-green/50 bg-black/35 px-3 py-2">
                  <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-orange">Unit</span>
                  <select
                    className="w-full rounded-lg border border-brand-green/55 bg-black/55 px-2 py-1.5 text-sm font-extrabold text-brand-cream outline-none focus:border-brand-orange"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'unit', event.target.value)}
                    value={item.unit}
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                  </select>
                </label>

                <label className="rounded-xl border border-brand-green/50 bg-black/35 px-3 py-2">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-orange">
                    <CircleDollarSign size={12} />
                    Price (KES)
                  </span>
                  <input
                    className="w-full rounded-lg border border-brand-green/55 bg-black/55 px-2 py-1.5 text-sm font-extrabold text-brand-cream outline-none focus:border-brand-orange"
                    min="0"
                    onChange={(event) => onUpdateIngredient?.(item.id, 'price', event.target.value)}
                    step="10"
                    type="number"
                    value={item.price}
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-brand-orange/45 bg-brand-orange/20 px-3 py-2">
                <span className="text-xs font-black uppercase tracking-wider text-brand-cream">Auto count: x{item.count}</span>
                <span className="text-sm font-black text-brand-cream">{formatKes?.(item.price * item.quantity || 0)}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm font-semibold text-brand-cream">
            No ingredients yet. Add meal names in Weekly Planner.
          </p>
        )}
      </div>
    </section>
  )
}

export default Grocery
