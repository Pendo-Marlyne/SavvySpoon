import { useState } from 'react'
import { Banknote, UtensilsCrossed } from 'lucide-react'

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin')
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    password: '',
  })

  const isSignup = mode === 'signup'
  const passwordTooShort = (formData.password || '').length > 0 && (formData.password || '').length < 5
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setError('')
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if ((formData.password || '').length < 5) return

    const trimmedEmail = (formData.email || '').trim().toLowerCase()
    if (!trimmedEmail) {
      setError('Please enter your Gmail address.')
      return
    }

    if (isSignup) {
      const profile = {
        name: formData.name || 'Savvyspoon User',
        location: formData.location || 'Kenya',
        email: trimmedEmail,
        password: formData.password,
      }
      localStorage.setItem('savvyspoon.userProfile', JSON.stringify(profile))
      onAuthSuccess({ role: 'account', profile })
      return
    }

    const raw = localStorage.getItem('savvyspoon.userProfile')
    if (!raw) {
      setError('No account found. Please create an account first.')
      return
    }
    try {
      const stored = JSON.parse(raw)
      const storedEmail = (stored.email || '').trim().toLowerCase()
      if (storedEmail !== trimmedEmail || stored.password !== formData.password) {
        setError('Email or password is incorrect.')
        return
      }
      onAuthSuccess({ role: 'account', profile: stored })
    } catch {
      setError('Unable to read saved account. Please create a new account.')
    }
  }

  return (
    <main className="min-h-screen bg-cover bg-center px-4 py-6 md:px-8" style={{ backgroundImage: "url('/homemade.webp')" }}>
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/35 bg-white/30 shadow-card backdrop-blur-sm lg:grid-cols-2">
        <section className="relative hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/homemade.webp')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/85 via-amber-500/75 to-orange-700/85" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
            <p className="text-4xl font-extrabold italic leading-tight text-amber-100">
              Master Your Kitchen
              <br />
              Master Your Budget
            </p>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-6 md:p-10">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/homemade.webp')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-amber-50/20 backdrop-blur-[2px]" />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/25 p-6 shadow-card backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-white">
                <div className="flex items-center gap-0.5">
                  <UtensilsCrossed size={16} />
                  <Banknote size={14} />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                <span className="text-brand-green">Savvy</span>
                <span className="text-brand-orange">spoon</span>
              </h1>
            </div>

            <div className="mb-5 rounded-2xl border border-white/45 bg-white/35 p-1 shadow-sm backdrop-blur-xl">
              <div className="grid grid-cols-2 rounded-xl bg-gradient-to-r from-amber-200/15 via-orange-200/10 to-amber-200/15 p-1">
              <button
                className={`group relative rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/60 ${
                  !isSignup
                      ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-slate-900 shadow-md ring-1 ring-amber-200/60'
                      : 'text-slate-800 hover:bg-white/45'
                }`}
                onClick={() => setMode('signin')}
                type="button"
              >
                  <span className="relative z-10 font-extrabold tracking-wide">Sign In</span>
                  <span
                    className="pointer-events-none absolute inset-0 -z-0 rounded-xl opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-90 group-focus-visible:opacity-95"
                    style={{
                      background:
                        'radial-gradient(70% 90% at 50% 45%, rgba(245, 158, 11, 0.75), rgba(245, 158, 11, 0))',
                    }}
                  />
              </button>
              <button
                className={`group relative rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/60 ${
                  isSignup
                      ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-slate-900 shadow-md ring-1 ring-amber-200/60'
                      : 'text-slate-800 hover:bg-white/45'
                }`}
                onClick={() => setMode('signup')}
                type="button"
              >
                  <span className="relative z-10 font-extrabold tracking-wide">Create Account</span>
                  <span
                    className="pointer-events-none absolute inset-0 -z-0 rounded-xl opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-90 group-focus-visible:opacity-95"
                    style={{
                      background:
                        'radial-gradient(70% 90% at 50% 45%, rgba(245, 158, 11, 0.75), rgba(245, 158, 11, 0))',
                    }}
                  />
              </button>
            </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  isSignup ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <input
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none"
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                />
                <input
                  className="mt-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none"
                  onChange={(event) => handleChange('location', event.target.value)}
                  placeholder="Location"
                  type="text"
                  value={formData.location}
                />
              </div>

              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none"
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Gmail address"
                required
                type="email"
                value={formData.email}
              />
              <input
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm focus:outline-none ${
                  passwordTooShort ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-brand-green'
                }`}
                onChange={(event) => handleChange('password', event.target.value)}
                minLength={5}
                placeholder="Password (min 5 characters)"
                required
                type="password"
                value={formData.password}
              />
              {passwordTooShort ? (
                <p className="text-xs font-semibold text-red-600">Password must be at least 5 characters.</p>
              ) : null}
              {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

              <button
                className="w-full rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                type="submit"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button
              className="mt-3 w-full rounded-xl border border-brand-orange/45 bg-brand-orange/10 px-4 py-3 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-orange/20"
              onClick={() => onAuthSuccess({ role: 'guest' })}
              type="button"
            >
              Continue as Guest
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth
