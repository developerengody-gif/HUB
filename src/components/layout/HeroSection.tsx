import { Radio, ArrowRight, Cpu, Gamepad2, FileText } from 'lucide-react'

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="overview" className="relative min-h-screen flex items-center pt-16 grid-bg overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/50 border border-navy-600 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Student Engineering Research Project
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight text-balance leading-tight">
          Signal Coverage
          <span className="block text-cyan-400">Hub</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mt-6 max-w-2xl leading-relaxed">
          A visual hub presenting research into indoor signal coverage using optimized node
          placement, mathematical modeling, phased-array beam steering, and hardware prototyping.
          Learn the problem through simulation, then explore the real engineering behind it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={() => scrollTo('simulation')} className="btn-primary">
            <Gamepad2 size={18} /> Explore Simulation
            <ArrowRight size={16} />
          </button>
          <button onClick={() => scrollTo('real-project')} className="btn-secondary">
            <Cpu size={18} /> Explore Real Project
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl">
          {[
            { value: '80%', label: 'Power Reduction' },
            { value: '44.8%', label: 'Node Density Reduction' },
            { value: '19.0 dB', label: 'Peak Signal' },
            { value: '64%', label: 'Excellent Coverage' },
          ].map((s) => (
            <div key={s.label} className="border-l border-navy-600/50 pl-4">
              <p className="text-2xl md:text-3xl font-bold font-mono text-cyan-300">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-mono mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-12 text-sm text-slate-500">
          <FileText size={16} />
          <span>All metrics sourced from the project's engineering report</span>
        </div>
      </div>
    </section>
  )
}
