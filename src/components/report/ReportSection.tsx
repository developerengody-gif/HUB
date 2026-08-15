import { useState, useEffect } from 'react'
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Layers,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import {
  reportSections,
  reportPath,
  getReportSection,
  type ReportSectionData,
  type ReportSubsection,
} from '../../data/projectData'

type View =
  | { kind: 'list' }
  | { kind: 'section'; sectionId: string }
  | { kind: 'pdf'; sectionId: string; subsectionId?: string }

export function ReportSection() {
  const [view, setView] = useState<View>({ kind: 'list' })
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    setZoom(100)
  }, [view])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  if (view.kind === 'pdf') {
    return (
      <PdfViewer
        view={view}
        zoom={zoom}
        setZoom={setZoom}
        onBack={() =>
          setView({ kind: 'section', sectionId: view.sectionId })
        }
      />
    )
  }

  if (view.kind === 'section') {
    const section = getReportSection(view.sectionId)
    if (!section) {
      setView({ kind: 'list' })
      return null
    }
    const index = reportSections.findIndex((s) => s.id === section.id)
    const prev = index > 0 ? reportSections[index - 1] : null
    const next = index < reportSections.length - 1 ? reportSections[index + 1] : null

    return (
      <section id="report" className="py-20 px-4 md:px-8 relative grid-bg-fine">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView({ kind: 'list' })}
            className="btn-ghost mb-6"
          >
            <ArrowLeft size={16} /> Back to Report
          </button>

          <div className="card-surface p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400/80 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                Section {section.number}
              </span>
              <span className="text-xs text-slate-500 font-mono">p. {section.page}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {section.title}
            </h2>

            <p className="text-slate-400 mt-4 leading-relaxed">{section.description}</p>

            {section.subsections ? (
              <div className="mt-8">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">
                  Subsections — each opens its own PDF
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() =>
                        setView({
                          kind: 'pdf',
                          sectionId: section.id,
                          subsectionId: sub.id,
                        })
                      }
                      className="card-surface-hover p-4 text-left group flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {sub.title}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                  Topics in this section
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.topics.map((topic) => (
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
            )}

            {section.projectLink && (
              <div className="mt-6 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30">
                <p className="text-sm text-slate-400">
                  <span className="text-cyan-400 font-mono">Related project area:</span>{' '}
                  This section connects to the Hub's{' '}
                  <button
                    onClick={() => scrollTo(section.projectLink!)}
                    className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
                  >
                    {section.projectLink === 'results'
                      ? 'Results Dashboard'
                      : section.projectLink === 'journey'
                        ? 'Project Journey'
                        : 'Real Project'}
                  </button>{' '}
                  area.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  setView({ kind: 'pdf', sectionId: section.id })
                }
                className="btn-primary"
              >
                <FileText size={16} /> Open Section PDF
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={() => prev && setView({ kind: 'section', sectionId: prev.id })}
              disabled={!prev}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> {prev ? prev.title : 'Previous'}
            </button>
            <button
              onClick={() => next && setView({ kind: 'section', sectionId: next.id })}
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
            Browse the original project report by section. Each section opens its
            real PDF — read, scroll, zoom, and download directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setView({ kind: 'section', sectionId: section.id })}
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
                    {section.subsections && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                        {section.subsections.length} PDFs
                      </span>
                    )}
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

function PdfViewer({
  view,
  zoom,
  setZoom,
  onBack,
}: {
  view: Extract<View, { kind: 'pdf' }>
  zoom: number
  setZoom: (z: number) => void
  onBack: () => void
}) {
  const section = getReportSection(view.sectionId)
  const subsection = view.subsectionId
    ? section?.subsections?.find((s) => s.id === view.subsectionId)
    : undefined

  const pdfPath = subsection?.pdfPath ?? section?.pdfPath ?? reportPath
  const page = subsection?.page ?? section?.page
  const title = subsection?.title ?? section?.title ?? 'Report'

  const viewerUrl = page ? `${pdfPath}#page=${page}&view=FitH` : `${pdfPath}#view=FitH`

  return (
    <section id="report" className="py-20 px-4 md:px-8 relative grid-bg-fine">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button onClick={onBack} className="btn-ghost">
            <ArrowLeft size={16} /> Back to {section?.title ?? 'Report'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="btn-ghost"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-slate-500 font-mono w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="btn-ghost"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              title="Open in new tab"
            >
              <Maximize2 size={16} />
            </a>
            <a
              href={pdfPath}
              download
              className="btn-ghost"
              title="Download PDF"
            >
              <Download size={16} />
            </a>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400/80 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
              {section?.number ? `Section ${section.number}` : 'Report'}
            </span>
            {subsection && (
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400/80 px-2 py-1 rounded-md bg-gold-500/10 border border-gold-500/20">
                Subsection
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
          {page && (
            <p className="text-xs text-slate-500 font-mono mt-1">Page {page}</p>
          )}
        </div>

        <div
          className="card-surface overflow-hidden"
          style={{ height: '75vh', minHeight: '500px' }}
        >
          <iframe
            key={`${pdfPath}-${page}-${zoom}`}
            src={viewerUrl}
            title={`${title} — PDF`}
            className="w-full h-full border-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          />
        </div>

        <p className="text-xs text-slate-600 mt-3 font-mono text-center">
          If the PDF does not display, use{' '}
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300"
          >
            open in new tab
          </a>{' '}
          or download.
        </p>
      </div>
    </section>
  )
}