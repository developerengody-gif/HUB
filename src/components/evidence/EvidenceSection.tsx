import { useState } from 'react'
import { ArrowRight, FileText, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import {
  evidenceItems,
  getReportSection,
  reportPageUrl,
} from '../../data/projectData'
import { usePersistentState } from '../../hooks/usePersistentState'
import { EvidenceModal, type CustomEvidence } from './EvidenceModal'

export function EvidenceSection() {
  const [customEvidence, setCustomEvidence] = usePersistentState<CustomEvidence[]>(
    'sch_evidence',
    [],
  )
  const [modalOpen, setModalOpen] = useState(false)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="evidence" className="py-20 px-4 md:px-8 relative grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">
              <ShieldCheck size={14} /> Evidence
            </span>
            <h2 className="section-title mt-2">Project Evidence</h2>
            <p className="text-slate-400 mt-3 max-w-3xl">
              Document the images, files, findings, and references that support the
              project. Added evidence stays in this browser.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary self-start md:self-auto"
          >
            <Plus size={16} /> Add Evidence
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceItems.map((item) => {
            const report = getReportSection(item.reportId)
            return (
              <div key={item.title} className="card-surface-hover p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-300 mt-1.5">
                      <span className="text-cyan-400/80 font-mono">Proves:</span>{' '}
                      {item.proves}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      {item.source} · p. {item.page}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {report && (
                        <button
                          onClick={() => scrollTo('report')}
                          className="text-xs text-cyan-400/60 font-mono hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                          <FileText size={11} /> Report — Section {report.number}
                        </button>
                      )}
                      <a
                        href={reportPageUrl(item.page)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 font-mono hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        <ArrowRight size={11} /> Open in PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {customEvidence.map((item) => (
            <div key={item.id} className="card-surface-hover p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <button
                      onClick={() =>
                        setCustomEvidence((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                      className="btn-ghost p-1 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {item.file?.startsWith('data:image/') && (
                    <img
                      src={item.file}
                      alt={item.title}
                      className="w-full max-h-52 object-contain rounded-lg bg-navy-950 mt-3"
                    />
                  )}
                  {item.description && (
                    <p className="text-sm text-slate-300 mt-2">{item.description}</p>
                  )}
                  {item.proves && (
                    <p className="text-sm text-slate-300 mt-2">
                      <span className="text-cyan-400/80 font-mono">Proves:</span>{' '}
                      {item.proves}
                    </p>
                  )}
                  {item.source && (
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      {item.source}
                    </p>
                  )}
                  {item.reportReference && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Report: {item.reportReference}
                    </p>
                  )}
                  {item.fileName && (
                    <p className="text-xs text-slate-600 mt-2 font-mono">
                      File: {item.fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <EvidenceModal
          onSave={(item) =>
            setCustomEvidence((current) => [...current, item])
          }
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  )
}
