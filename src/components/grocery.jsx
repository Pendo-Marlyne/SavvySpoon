import { ShoppingCart } from 'lucide-react'

function Grocery({ groceryList }) {
  return (
    <section className="rounded-3xl border border-brand-orange/20 bg-brand-cream/60 p-6 shadow-card backdrop-blur-xl animate-fade-up">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-brand-green-dark">
        <ShoppingCart size={22} />
        Grocery List Page
      </h2>
      <p className="mt-1 text-sm text-[#6B6058]">Auto-generated ingredients from planned meals.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {groceryList.length > 0 ? (
          groceryList.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl border border-brand-orange/15 bg-brand-green/10 px-4 py-3">
              <span className="font-semibold text-[#3D2A22]">{item.name}</span>
              <span className="rounded-full bg-brand-orange/25 px-3 py-1 text-xs font-bold text-[#3D2A22]">x{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#6B6058]">No ingredients yet. Add meal names in Weekly Planner.</p>
        )}
      </div>
    </section>
  )
}

export default Grocery
