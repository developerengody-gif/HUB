import { useState, useRef, useEffect } from 'react'
import { X, Upload, Link2, Mail, Github, Globe, Linkedin, User } from 'lucide-react'
import type { TeamMember } from '../../types'
import { emptyMember } from '../../types'

interface Props {
  member: TeamMember | null
  onSave: (data: Omit<TeamMember, 'id'>) => void
  onClose: () => void
}

export function MemberModal({ member, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(emptyMember())
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (member) {
      const { id: _id, ...rest } = member
      void _id
      setForm(rest)
    }
  }, [member])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('Please enter a name.')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card-surface w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {member ? 'Edit Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border border-navy-600 overflow-hidden flex items-center justify-center bg-navy-850 flex-shrink-0">
              {form.photo ? (
                <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-slate-600" />
              )}
            </div>
            <div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary">
                <Upload size={16} /> Upload Photo
              </button>
              {form.photo && (
                <button type="button" onClick={() => setForm((p) => ({ ...p, photo: null }))} className="btn-ghost ml-2">
                  Remove
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. Hardware Lead"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Short bio"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-slate-400">Links</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Linkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                placeholder="LinkedIn URL"
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))}
                placeholder="GitHub URL"
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                placeholder="Website URL"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              <Link2 size={16} /> {member ? 'Save Changes' : 'Add Member'}
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
