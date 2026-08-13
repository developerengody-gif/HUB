import { Workflow, ArrowRight, FileText } from 'lucide-react'
import { projectJourney, getReportSection } from '../../data/projectData'

export function JourneySection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="journey" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label">
            <Workflow size={14} /> Project Journey
          </span>
          <h2 className="section-title mt-2">The Technical Pipeline</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            The project follows a structured engineering pipeline — from problem definition
            through mathematical modeling, simulation, optimization, and experimental validation.
            Each step is grounded in the project report.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-navy-600/40 to-transparent" />

          <div className="space-y-4">
            {projectJourney.map((step) => {
              const report = getReportSection(step.reportId)
              return (
                <div key={step.number} className="relative flex items-start gap-4 md:gap-6">
                  <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm md:text-base font-bold font-mono text-cyan-400">
                      {step.number}
                    </span>
                  </div>

                  <div className="flex-1 card-surface-hover p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      {report && (
                        <button
                          onClick={() => scrollTo('report')}
                          className="text-xs text-cyan-400/60 font-mono hover:text-cyan-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
                        >
                          <FileText size={12} /> Report — Section {report.number}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1.5">{step.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => scrollTo('report')} className="btn-secondary">
            Explore the Full Report <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
