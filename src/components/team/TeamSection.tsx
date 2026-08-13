import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { useTeamMembers } from '../../hooks/useTeamMembers'
import { MemberCard } from './MemberCard'
import { MemberModal } from './MemberModal'
import type { TeamMember } from '../../types'

export function TeamSection() {
  const { members, loaded, addMember, updateMember, deleteMember } = useTeamMembers()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (member: TeamMember) => {
    setEditing(member)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Remove this team member?')) {
      deleteMember(id)
    }
  }

  const handleSave = (data: Omit<TeamMember, 'id'>) => {
    if (editing) {
      updateMember(editing.id, data)
    } else {
      addMember(data)
    }
  }

  return (
    <section id="team" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">
              <Users size={14} /> Team
            </span>
            <h2 className="section-title mt-2">The Engineering Team</h2>
            <p className="text-slate-400 mt-3 max-w-2xl">
              The researchers behind this project. Add, edit, and manage team member profiles —
              all data is saved locally in your browser.
            </p>
          </div>
          <button onClick={handleAdd} className="btn-primary self-start md:self-auto">
            <UserPlus size={18} /> Add Member
          </button>
        </div>

        {loaded && (
          <>
            {members.length === 0 ? (
              <div className="card-surface p-12 text-center">
                <Users size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No team members yet. Click "Add Member" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <MemberModal
          member={editing}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  )
}
