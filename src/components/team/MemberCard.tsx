import { User, Mail, Github, Globe, Linkedin, Pencil, Trash2 } from 'lucide-react'
import type { TeamMember } from '../../types'

interface Props {
  member: TeamMember
  onEdit: (member: TeamMember) => void
  onDelete: (id: string) => void
}

export function MemberCard({ member, onEdit, onDelete }: Props) {
  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const hasLinks = member.email || member.linkedin || member.github || member.website

  return (
    <div className="card-surface-hover group relative overflow-hidden flex flex-col">
      <div className="h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0" />

      {/* Large photo at top */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-navy-850 border-b border-navy-700/50">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-cyan-400/40 font-mono">
              {initials || <User size={48} className="text-slate-600" />}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Info below photo */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-white leading-tight">
          {member.name || 'Unnamed Member'}
        </h3>
        <p className="text-sm text-cyan-400/80 font-mono mt-1">
          {member.role || 'Role TBD'}
        </p>

        {member.bio && (
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Links */}
        {hasLinks && (
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-navy-700/50">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-navy-800/50 transition-all"
                title="Email"
              >
                <Mail size={16} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-navy-800/50 transition-all"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-navy-800/50 transition-all"
                title="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-navy-800/50 transition-all"
                title="Website"
              >
                <Globe size={16} />
              </a>
            )}
          </div>
        )}

        {/* Edit/delete - push to bottom */}
        <div className="flex items-center gap-1 mt-auto pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-navy-800/50 transition-all"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-navy-800/50 transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
