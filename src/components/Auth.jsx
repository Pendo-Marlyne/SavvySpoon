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

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem(
      'savvyspoon.userProfile',
      JSON.stringify({
        name: formData.name || 'Savvyspoon User',
        location: formData.location || 'Kenya',
        email: formData.email,
      }),
    )
    onAuthSuccess()
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

        <section className="flex items-center justify-center bg-white/70 p-6 backdrop-blur-xl md:p-10">
          <div className="w-full max-w-md">
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

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${!isSignup ? 'bg-white text-brand-green shadow-sm' : 'text-slate-600'}`}
                onClick={() => setMode('signin')}
                type="button"
              >
                Sign In
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${isSignup ? 'bg-white text-brand-green shadow-sm' : 'text-slate-600'}`}
                onClick={() => setMode('signup')}
                type="button"
              >
                Create Account
              </button>
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none"
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={formData.password}
              />

              <button
                className="w-full rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                type="submit"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button
              className="mt-3 w-full rounded-xl border border-brand-orange/45 bg-brand-orange/10 px-4 py-3 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-orange/20"
              onClick={onAuthSuccess}
              type="button"
            >
              Continue as Guest
            </button>

            <p className="mt-4 text-xs text-slate-600">
              Guest mode gives access to the homepage and a quick overview of weekly budgeting and ingredients.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth
