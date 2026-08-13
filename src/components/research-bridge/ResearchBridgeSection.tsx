import {
  Microscope,
  Sigma,
  Calculator,
  Crosshair,
  Gamepad2,
  Cpu,
  ArrowDown,
} from 'lucide-react'

const steps = [
  { icon: Microscope, label: 'Research', detail: 'Problem definition and literature review' },
  { icon: Sigma, label: 'Mathematical Model', detail: 'Helmholtz equation and finite-difference methods' },
  { icon: Calculator, label: 'Numerical Simulation', detail: 'MATLAB-based field and coverage computation' },
  { icon: Crosshair, label: 'Optimization', detail: 'Node placement refinement and phased-array steering' },
  { icon: Gamepad2, label: 'Interactive Simulation', detail: 'The game lets you experience the problem hands-on' },
  { icon: Cpu, label: 'Real Project', detail: 'Validated engineering results and hardware proof of concept' },
]

export function ResearchBridgeSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="research-bridge" className="py-20 px-4 md:px-8 relative grid-bg-fine">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="section-label justify-center">
            <ArrowDown size={14} /> Research → Implementation
          </span>
          <h2 className="section-title mt-2">From Research to Implementation</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            The interactive simulation represents the underlying engineering concept. The real
            project contains the actual mathematical modeling, numerical simulation, optimization,
            and hardware validation.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center w-full">
              <div className="card-surface-hover p-5 w-full max-w-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <step.icon size={22} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{step.label}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{step.detail}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowDown size={20} className="text-slate-600 my-1" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30 text-center">
          <p className="text-sm text-slate-500">
            <span className="text-cyan-400 font-mono">Important:</span> The game is an
            interactive representation of the engineering problem. The validated results come
            from the real project's mathematical modeling and MATLAB simulation, not from the game.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => scrollTo('simulation')} className="btn-secondary">
            <Gamepad2 size={16} /> Try the Simulation
          </button>
          <button onClick={() => scrollTo('real-project')} className="btn-gold">
            <Cpu size={16} /> Explore Real Project
          </button>
        </div>
      </div>
    </section>
  )
}
