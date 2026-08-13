import { useState, useEffect } from 'react'
import { Radio, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Journey', href: '#journey' },
  { label: 'Simulation', href: '#simulation' },
  { label: 'Real Project', href: '#real-project' },
  { label: 'Results', href: '#results' },
  { label: 'Academy', href: '#academy' },
  { label: 'Report', href: '#report' },
  { label: 'Team', href: '#team' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Radio size={18} className="text-cyan-400" />
            </div>
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
          </nav>
        )}
      </div>
    </header>
  )
}
