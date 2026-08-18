import { useState, useEffect } from 'react'
import { Menu, X, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { AuthModal } from '../auth/AuthModal'

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Discover', href: '#discover-spark-squad' },
  { label: 'Journey', href: '#journey' },
  { label: 'Simulation', href: '#real-project' },
  { label: 'Real Project', href: '#real-project' },
  { label: 'Results', href: '#results' },
  { label: 'Academy', href: '#academy' },
  { label: 'Report', href: '#report' },
  { label: 'Team', href: '#team' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { isAdmin, email, signOut } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-navy-950/90 backdrop-blur-md border-b border-navy-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
              <img src="/spark-squad-logo.png" alt="Spark Squad logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-white text-sm tracking-wide hidden sm:block">
                SIGNAL COVERAGE HUB
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="px-3 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-navy-800/50"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    <ShieldCheck size={13} /> Admin
                  </span>
                  <button onClick={() => void signOut()} className="btn-ghost" title={`Signed in as ${email}`}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="btn-secondary">
                  <LogIn size={15} /> Admin Login
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-cyan-300"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {mobileOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="px-4 py-2.5 text-sm text-slate-400 hover:text-cyan-300 hover:bg-navy-800/50 rounded-lg text-left transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-2 pt-2 border-t border-navy-700/50">
                {isAdmin ? (
                  <button onClick={() => void signOut()} className="px-4 py-2.5 text-sm text-slate-400 hover:text-cyan-300 text-left w-full">
                    <LogOut size={15} className="inline mr-2" /> Sign out ({email})
                  </button>
                ) : (
                  <button onClick={() => { setMobileOpen(false); setAuthOpen(true) }} className="px-4 py-2.5 text-sm text-slate-400 hover:text-cyan-300 text-left w-full">
                    <LogIn size={15} className="inline mr-2" /> Admin Login
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
