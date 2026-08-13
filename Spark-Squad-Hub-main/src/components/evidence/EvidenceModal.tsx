import { useState } from 'react'
import { FileUp, Save, X } from 'lucide-react'

export interface CustomEvidence {
  id: string
  title: string
  description: string
  proves: string
  source: string
  reportReference: string
  file?: string
  fileName?: string
}

interface Props {
  onSave: (item: CustomEvidence) => void
  onClose: () => void
}

export function EvidenceModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<CustomEvidence, 'id'>>({
    title: '',
    description: '',
    proves: '',
    source: '',
    reportReference: '',
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const fileChange = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () =>
      setForm((current) => ({
        ...current,
        file: reader.result as string,
        fileName: file.name,
      }))
    reader.readAsDataURL(file)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      id: `evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Add Evidence</h2>
            <p className="text-sm text-slate-500 mt-1">
              Use only real project references.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3 mt-6">
          <input
            required
            value={form.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="Title"
            className="input-field"
          />
          <textarea
            value={form.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Description"
            rows={2}
            className="input-field resize-none"
          />
          <textarea
            value={form.proves}
            onChange={(event) => set('proves', event.target.value)}
            placeholder="What it proves"
            rows={2}
            className="input-field resize-none"
          />
          <input
            value={form.source}
            onChange={(event) => set('source', event.target.value)}
            placeholder="Source or reference"
            className="input-field"
          />
          <input
            value={form.reportReference}
            onChange={(event) => set('reportReference', event.target.value)}
            placeholder="Report reference (optional)"
            className="input-field"
          />
          <label className="btn-secondary cursor-pointer w-full">
            <FileUp size={16} /> {form.fileName || 'Upload image or file'}
            <input
              type="file"
              className="hidden"
              onChange={(event) => fileChange(event.target.files?.[0])}
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save evidence
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
