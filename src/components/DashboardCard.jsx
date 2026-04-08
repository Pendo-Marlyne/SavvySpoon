const toneClasses = {
  green: 'bg-brand-green text-white',
  orange: 'bg-brand-orange text-zinc-900',
  neutral: 'bg-white text-zinc-900 border border-zinc-200',
}

function DashboardCard({ title, value, caption, tone, icon }) {
  const IconComponent = icon

  return (
    <article className={`rounded-3xl p-5 shadow-card ${toneClasses[tone]}`}>
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">{title}</h3>
        {IconComponent ? <IconComponent size={20} className="opacity-90" /> : null}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm opacity-85">{caption}</p>
    </article>
  )
}

export default DashboardCard
