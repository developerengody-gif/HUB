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

  return (
    <div className="card-surface-hover group relative overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-navy-600 bg-navy-850 flex items-center justify-center">
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-cyan-400/60 font-mono">
                {initials || <User size={24} />}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {member.name || 'Unnamed Member'}
            </h3>
            <p className="text-sm text-cyan-400/80 font-mono mt-0.5">{member.role || 'Role TBD'}</p>
            {member.bio && (
              <p className="text-sm text-slate-400 mt-2 line-clamp-2">{member.bio}</p>
            )}
          </div>
        </div>

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

          <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  )
}
