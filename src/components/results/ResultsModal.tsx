import { useState } from 'react'
import { Save, X } from 'lucide-react'

export interface EditableMetric {
  id: string
  label: string
  value: string
  detail: string
  source: string
}

interface Props {
  metrics: EditableMetric[]
  onSave: (metrics: EditableMetric[]) => void
  onClose: () => void
}

export function ResultsModal({ metrics, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<EditableMetric[]>(metrics)
  const update = (id: string, changes: Partial<EditableMetric>) =>
    setDraft((current) =>
      current.map((metric) =>
        metric.id === id ? { ...metric, ...changes } : metric,
      ),
    )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Results</h2>
            <p className="text-sm text-slate-500 mt-1">
              Leave values blank when the report does not provide them.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSave(draft)
            onClose()
          }}
          className="space-y-4 mt-6"
        >
          {draft.map((metric) => (
            <div
              key={metric.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-navy-700/50 bg-navy-850/40 p-4"
            >
              <input
                value={metric.label}
                onChange={(event) =>
                  update(metric.id, { label: event.target.value })
                }
                placeholder="Metric name"
                className="input-field"
              />
              <input
                value={metric.value}
                onChange={(event) =>
                  update(metric.id, { value: event.target.value })
                }
                placeholder="Verified value"
                className="input-field"
              />
              <input
                value={metric.detail}
                onChange={(event) =>
                  update(metric.id, { detail: event.target.value })
                }
                placeholder="Details"
                className="input-field"
              />
              <input
                value={metric.source}
                onChange={(event) =>
                  update(metric.id, { source: event.target.value })
                }
                placeholder="Source or report reference"
                className="input-field"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save results
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
