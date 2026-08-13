import { GraduationCap, FileText, ArrowRight } from 'lucide-react'
import { academyTopics, getReportSection } from '../../data/projectData'

export function AcademySection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="academy" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label">
            <GraduationCap size={14} /> Academy
          </span>
          <h2 className="section-title mt-2">Learn the Concepts</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Short, visual explanations of the key engineering concepts behind the project.
            Each topic is grounded in the project report — no invented technical claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {academyTopics.map((topic) => {
            const report = getReportSection(topic.reportId)
            return (
              <div key={topic.title} className="card-surface-hover p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-850 border border-navy-600 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{topic.title}</h3>
                    <p className="text-sm text-slate-400 mt-1.5">{topic.description}</p>
                    {report && (
                      <button
                        onClick={() => scrollTo('report')}
                        className="text-xs text-cyan-400/60 font-mono hover:text-cyan-300 transition-colors flex items-center gap-1 mt-3"
                      >
                        <FileText size={11} /> See Report — Section {report.number}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={() => scrollTo('report')} className="btn-secondary">
            Explore the Full Report <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
