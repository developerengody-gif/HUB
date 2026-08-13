import { Radio } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-navy-700/50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Radio size={16} className="text-cyan-400" />
          </div>
          <span className="text-sm text-slate-500 font-mono">SIGNAL COVERAGE HUB</span>
        </div>
        <p className="text-xs text-slate-600 font-mono">
          Phase 3 — Complete Research Experience
        </p>
      </div>
    </footer>
  )
}
