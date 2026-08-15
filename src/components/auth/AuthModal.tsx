import { useState } from 'react'
import { X, Mail, Lock, CircleAlert as AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setBusy(true)
    const fn = mode === 'signin' ? signIn : signUp
    const { error: err } = await fn(email.trim(), password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="card-surface w-full max-w-md p-6 md:p-8 relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <img src="/spark-squad-logo.png" alt="Spark Squad" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'signin' ? 'Admin Login' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {mode === 'signin' ? 'Sign in to manage Hub content' : 'Sign up to manage Hub content'}
            </p>
          </div>
        </div>

        {mode === 'signin' && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <ShieldCheck size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Only the admin account can upload, replace, or delete the Guide and Demo files.
              Visitors can always view them.
            </p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
            }}
            className="text-xs text-slate-500 hover:text-cyan-300 transition-colors"
          >
            {mode === 'signin'
              ? "Need an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
