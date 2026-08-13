import { useState } from 'react'
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Layers,
} from 'lucide-react'
import {
  reportSections,
  reportPath,
  getReportSection,
} from '../../data/projectData'

export function ReportSection() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = activeId ? getReportSection(activeId) : null
  const activeIndex = reportSections.findIndex((s) => s.id === activeId)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (active) {
    const prev = activeIndex > 0 ? reportSections[activeIndex - 1] : null
    const next = activeIndex < reportSections.length - 1 ? reportSections[activeIndex + 1] : null

    return (
      <section id="report" className="py-20 px-4 md:px-8 relative grid-bg-fine">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setActiveId(null)} className="btn-ghost mb-6">
            <ArrowLeft size={16} /> Back to Report
          </button>

          <div className="card-surface p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400/80 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                Section {active.number}
              </span>
              <span className="text-xs text-slate-500 font-mono">p. {active.page}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {active.title}
            </h2>

            <p className="text-slate-400 mt-4 leading-relaxed">{active.description}</p>

            <div className="mt-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                Topics in this section
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {active.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-2 text-sm text-slate-300 px-3 py-2 rounded-lg bg-navy-850/50 border border-navy-700/40"
                  >
                    <Layers size={14} className="text-cyan-400/60 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            {active.projectLink && (
              <div className="mt-6 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30">
                <p className="text-sm text-slate-400">
                  <span className="text-cyan-400 font-mono">Related project area:</span>{' '}
                  This section connects to the Hub's{' '}
                  <button
                    onClick={() => scrollTo(active.projectLink!)}
                    className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
                  >
                    {active.projectLink === 'results'
                      ? 'Results Dashboard'
                      : active.projectLink === 'journey'
                        ? 'Project Journey'
                        : 'Real Project'}
                  </button>{' '}
                  area.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`${reportPath}#page=${active.page}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FileText size={16} /> Read in Full Report
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={() => prev && setActiveId(prev.id)}
              disabled={!prev}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> {prev ? prev.title : 'Previous'}
            </button>
            <button
              onClick={() => next && setActiveId(next.id)}
              disabled={!next}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {next ? next.title : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="report" className="py-20 px-4 md:px-8 relative grid-bg-fine">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label">
            <FileText size={14} /> Project Report
          </span>
          <h2 className="section-title mt-2">The Engineering Report</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Explore the original project report by section. Each entry summarizes the actual
            content from the report and links to the full PDF where you can read the details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveId(section.id)}
              className="card-surface-hover p-5 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-850 border border-navy-600 flex items-center justify-center flex-shrink-0 font-mono text-cyan-400 font-bold">
                  {section.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 mt-1.5 line-clamp-2">
                    {section.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-600 font-mono">p. {section.page}</span>
                    {section.projectLink && (
                      <span className="text-xs text-cyan-400/60 font-mono">Linked to project</span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={reportPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <FileText size={16} /> Open Full Report (PDF)
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
