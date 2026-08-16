import { useState } from 'react'
import { ChartBar as BarChart3, FileText, Pencil } from 'lucide-react'
import { projectMetrics, projectParameters } from '../../data/projectData'
import { useCloudSetting } from '../../hooks/useCloudSetting'
import { ResultsModal, type EditableMetric } from './ResultsModal'

const editableLabels = [
  'Coverage',
  'Dead-Zone Reduction',
  'Candidate Nodes',
  'Final Nodes',
  'Node Density',
  'Power Reduction',
  'Peak Signal',
  'Excellent Coverage',
]

const initialMetrics: EditableMetric[] = editableLabels.map((label) => {
  const existing = projectMetrics.find(
    (metric) => metric.label.toLowerCase() === label.toLowerCase(),
  )
  return {
    id: `metric-${label}`,
    label,
    value: existing?.value ?? '',
    detail: existing?.detail ?? '',
    source: existing
      ? `${existing.reportSection} · p. ${existing.reportPage}`
      : '',
  }
})

export function ResultsDashboardSection() {
  const { value: metrics, setValue: setMetrics } = useCloudSetting<EditableMetric[]>(
    'results_metrics',
    initialMetrics,
  )
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="results" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">
              <BarChart3 size={14} /> Results Dashboard
            </span>
            <h2 className="section-title mt-2">Engineering Results Dashboard</h2>
            <p className="text-slate-400 mt-3 max-w-3xl">
              Validated project metrics from the engineering report. Blank fields remain blank
              until you add a verified value.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-secondary self-start md:self-auto"
          >
            <Pencil size={16} /> Edit Results
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="card-surface-hover p-5">
              <p className="stat-label mb-2">{metric.label}</p>
              <p className={`stat-value ${metric.value ? '' : 'text-slate-600'}`}>
                {metric.value || '—'}
              </p>
              {metric.detail && (
                <p className="text-sm text-slate-400 mt-2">{metric.detail}</p>
              )}
              {metric.source && (
                <p className="text-xs text-slate-600 mt-2 font-mono flex items-center gap-1">
                  <FileText size={11} /> {metric.source}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-cyan-400" />
            <h3 className="font-semibold text-white">Technical Parameters</h3>
            <span className="text-xs text-slate-500 font-mono ml-2">From report</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectParameters.map((p) => (
              <div
                key={p.label}
                className="p-4 rounded-lg bg-navy-850/50 border border-navy-700/40"
              >
                <p className="stat-label mb-1">{p.label}</p>
                <p className="text-xl font-bold font-mono text-cyan-300">{p.value}</p>
                <p className="text-xs text-slate-600 mt-1.5 font-mono">
                  {p.reportSection} · p. {p.page}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30">
          <p className="text-sm text-slate-500">
            <span className="text-cyan-400 font-mono">Source:</span> Add only verified
            values and references. Metrics not available in the report are intentionally
            left blank.
          </p>
        </div>
      </div>
      {modalOpen && (
        <ResultsModal
          metrics={metrics}
          onSave={setMetrics}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  )
}
