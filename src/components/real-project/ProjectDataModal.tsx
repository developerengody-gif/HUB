import { useState } from 'react'
import { FileImage, Plus, Save, Trash2, X, Loader as Loader2 } from 'lucide-react'
import { uploadImage } from '../../lib/cloudData'

export interface ProjectDataItem {
  id: string
  category:
    | 'Technical parameter'
    | 'Validated result'
    | 'Power data'
    | 'Node data'
    | 'Project image'
    | 'Engineering diagram'
  label: string
  value: string
  detail: string
  source: string
  file?: string
  fileName?: string
}

interface Props {
  items: ProjectDataItem[]
  onSave: (items: ProjectDataItem[]) => void
  onClose: () => void
}

const categories: ProjectDataItem['category'][] = [
  'Technical parameter',
  'Validated result',
  'Power data',
  'Node data',
  'Project image',
  'Engineering diagram',
]

const newItem = (): ProjectDataItem => ({
  id: `project-data-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  category: 'Technical parameter',
  label: '',
  value: '',
  detail: '',
  source: '',
})

export function ProjectDataModal({ items, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<ProjectDataItem[]>(items)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const update = (id: string, changes: Partial<ProjectDataItem>) =>
    setDraft((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    )

  const readFile = async (id: string, file?: File) => {
    if (!file) return
    setUploadingId(id)
    try {
      if (file.type.startsWith('image/')) {
        const url = await uploadImage(file, 'project')
        if (url) {
          update(id, { file: url, fileName: file.name })
        } else {
          const reader = new FileReader()
          reader.onload = () =>
            update(id, { file: reader.result as string, fileName: file.name })
          reader.readAsDataURL(file)
        }
      } else {
        const reader = new FileReader()
        reader.onload = () =>
          update(id, { file: reader.result as string, fileName: file.name })
        reader.readAsDataURL(file)
      }
    } finally {
      setUploadingId(null)
    }
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    onSave(
      draft.filter(
        (item) => item.label.trim() || item.value.trim() || item.file,
      ),
    )
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-white">Project Data</h2>
            <p className="text-sm text-slate-500 mt-1">
              Add only values and references from your project.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="space-y-4 mt-6">
            {draft.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-navy-700/50 bg-navy-850/40 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={item.category}
                    onChange={(event) =>
                      update(item.id, {
                        category: event.target.value as ProjectDataItem['category'],
                      })
                    }
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    value={item.label}
                    onChange={(event) =>
                      update(item.id, { label: event.target.value })
                    }
                    placeholder="Name"
                    className="input-field"
                  />
                  <input
                    value={item.value}
                    onChange={(event) =>
                      update(item.id, { value: event.target.value })
                    }
                    placeholder="Value (leave blank until verified)"
                    className="input-field"
                  />
                  <input
                    value={item.source}
                    onChange={(event) =>
                      update(item.id, { source: event.target.value })
                    }
                    placeholder="Source or reference"
                    className="input-field"
                  />
                  <textarea
                    value={item.detail}
                    onChange={(event) =>
                      update(item.id, { detail: event.target.value })
                    }
                    placeholder="Description or context"
                    rows={2}
                    className="input-field resize-none md:col-span-2"
                  />
                </div>
                {(item.category === 'Project image' ||
                  item.category === 'Engineering diagram') && (
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <label className="btn-secondary cursor-pointer">
                      <FileImage size={16} />{' '}
                      {uploadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : item.fileName ? 'Replace file' : 'Upload file'}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(event) =>
                          void readFile(item.id, event.target.files?.[0])
                        }
                      />
                    </label>
                    {item.fileName && (
                      <span className="text-xs text-slate-400 font-mono">
                        {item.fileName}
                      </span>
                    )}
                    {item.file && (
                      <button
                        type="button"
                        onClick={() =>
                          update(item.id, { file: undefined, fileName: undefined })
                        }
                        className="btn-ghost hover:text-red-400"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setDraft((current) =>
                      current.filter((entry) => entry.id !== item.id),
                    )
                  }
                  className="btn-ghost hover:text-red-400 mt-2"
                >
                  <Trash2 size={15} /> Remove entry
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button"
              onClick={() => setDraft((current) => [...current, newItem()])}
              className="btn-secondary"
            >
              <Plus size={16} /> Add data row
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save project data
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
