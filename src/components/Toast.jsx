import { useEffect } from 'react'
import { X } from 'lucide-react'

function Toast({ open, title, message, tone = 'warning', onClose }) {
  useEffect(() => {
    if (!open || !onClose) return undefined
    const timeoutId = window.setTimeout(() => onClose(), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [open, onClose])

  if (!open) return null

  const toneStyles =
    tone === 'danger'
      ? 'border-red-200 bg-red-50/80 text-red-900'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
        : 'border-amber-200 bg-amber-50/80 text-amber-950'

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        className={`pointer-events-auto w-full max-w-md rounded-2xl border p-4 shadow-card backdrop-blur-xl ${toneStyles}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold">{title}</p>
            {message ? <p className="mt-1 text-sm opacity-90">{message}</p> : null}
          </div>
          <button
            className="rounded-lg p-1.5 transition hover:bg-black/5"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
