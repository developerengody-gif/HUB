import {
  Gamepad2,
  Cpu,
  ArrowRight,
  Target,
  MousePointerClick,
  GraduationCap,
  MapPin,
  Building2,
  Signal,
  Radar,
  Network,
  TrendingUp,
} from 'lucide-react'

const simulationFeatures = [
  { icon: Target, text: 'Mission-based gameplay' },
  { icon: MousePointerClick, text: 'Interactive node placement' },
  { icon: GraduationCap, text: 'Designed for learning' },
  { icon: Gamepad2, text: 'Immediate gameplay feedback' },
]

const realProjectFeatures = [
  { icon: Cpu, text: 'Engineering model (Helmholtz/FDM)' },
  { icon: Building2, text: 'Building & environment data' },
  { icon: Signal, text: 'Signal propagation modeling' },
  { icon: MapPin, text: 'Dead-zone detection' },
  { icon: Network, text: 'Node placement & optimization' },
  { icon: Radar, text: 'Phased-array beam steering' },
  { icon: TrendingUp, text: 'Actual engineering results' },
]

const pathway = [
  { label: 'Learn the Problem', icon: GraduationCap },
  { label: 'Experience the Simulation', icon: Gamepad2 },
  { label: 'Understand the Engineering Solution', icon: Cpu },
]

export function ComparisonSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="comparison" className="py-20 px-4 md:px-8 relative grid-bg-fine">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <span className="section-label justify-center">
            <ArrowRight size={14} /> Bridge
          </span>
          <h2 className="section-title mt-2">From Simulation to Real Engineering</h2>
          <p className="text-slate-400 mt-3 max-w-3xl mx-auto">
            The simulation and the real project are two sides of the same coin. The game lets you
            experience the problem interactively; the engineering work solves it with mathematical
            rigor and hardware proof.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="card-surface p-6 border-l-2 border-l-cyan-500/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Gamepad2 size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Simulation</h3>
                <p className="text-xs text-cyan-400/60 font-mono">Interactive Learning Tool</p>
              </div>
            </div>
            <ul className="space-y-3">
              {simulationFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-slate-300">
                  <f.icon size={16} className="text-cyan-400/60 flex-shrink-0" />
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollTo('simulation')}
              className="btn-secondary mt-6 w-full"
            >
              <Gamepad2 size={16} /> Explore Simulation
            </button>
          </div>

          <div className="card-surface p-6 border-l-2 border-l-gold-500/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <Cpu size={20} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Real Project</h3>
                <p className="text-xs text-gold-400/60 font-mono">Engineering Research</p>
              </div>
            </div>
            <ul className="space-y-3">
              {realProjectFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-slate-300">
                  <f.icon size={16} className="text-gold-400/60 flex-shrink-0" />
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollTo('real-project')}
              className="btn-gold mt-6 w-full"
            >
              <Cpu size={16} /> Explore Real Project
            </button>
          </div>
        </div>

        <div className="card-surface p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {pathway.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-navy-850 border border-cyan-500/30 flex items-center justify-center mb-3">
                    <step.icon size={24} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{step.label}</p>
                </div>
                {i < pathway.length - 1 && (
                  <ArrowRight size={20} className="text-slate-600 hidden md:block flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
