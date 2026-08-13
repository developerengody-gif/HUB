import { useState, useEffect, useCallback } from 'react'
import type { TeamMember } from '../types'

const STORAGE_KEY = 'sch_team_members'

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as TeamMember[]
        if (Array.isArray(parsed)) {
          setMembers(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    }
  }, [members, loaded])

  const addMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    const id = `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setMembers((prev) => [...prev, { ...member, id }])
  }, [])

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }, [])

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { members, loaded, addMember, updateMember, deleteMember }
}
