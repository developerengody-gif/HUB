import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uploadImage, removeImage, dataUrlToFile } from '../lib/cloudData'
import { useAuth } from './useAuth'
import type { TeamMember } from '../types'

interface DbTeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo_url: string | null
  email: string
  linkedin: string
  github: string
  website: string
  sort_order: number
}

const STORAGE_KEY = 'sch_team_members'

function dbToMember(row: DbTeamMember): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photo: row.photo_url,
    email: row.email,
    linkedin: row.linkedin,
    github: row.github,
    website: row.website,
  }
}

function memberToDb(member: Omit<TeamMember, 'id'>): Omit<DbTeamMember, 'id' | 'sort_order'> {
  return {
    name: member.name,
    role: member.role,
    bio: member.bio,
    photo_url: member.photo,
    email: member.email,
    linkedin: member.linkedin,
    github: member.github,
    website: member.website,
  }
}

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loaded, setLoaded] = useState(false)
  const { isAdmin } = useAuth()

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      setMembers(data.map(dbToMember))
      setLoaded(true)
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as TeamMember[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed)
          setLoaded(true)
          if (isAdmin) {
            for (let i = 0; i < parsed.length; i++) {
              const m = parsed[i]
              await supabase.from('team_members').insert({
                id: m.id,
                ...memberToDb(m),
                sort_order: i,
              })
            }
          }
          return
        }
      }
    } catch {
      // ignore
    }

    setLoaded(true)
  }, [isAdmin])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const channel = supabase
      .channel('team_members_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        async () => {
          const { data } = await supabase
            .from('team_members')
            .select('*')
            .order('sort_order', { ascending: true })
          if (data) setMembers(data.map(dbToMember))
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addMember = useCallback(
    async (member: Omit<TeamMember, 'id'>) => {
      let photoUrl = member.photo
      if (member.photo && member.photo.startsWith('data:')) {
        const file = dataUrlToFile(member.photo, `${member.name || 'photo'}.png`)
        if (file) photoUrl = await uploadImage(file, 'member')
      }

      const newMember: TeamMember = {
        ...member,
        photo: photoUrl,
        id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      }

      setMembers((prev) => [...prev, newMember])

      if (isAdmin) {
        await supabase.from('team_members').insert({
          ...memberToDb(newMember),
          photo_url: photoUrl,
          sort_order: members.length,
        })
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...members, newMember]))
      } catch {
        // ignore
      }
    },
    [isAdmin, members],
  )

  const updateMember = useCallback(
    async (id: string, updates: Partial<TeamMember>) => {
      let photoUrl = updates.photo
      if (photoUrl && photoUrl.startsWith('data:')) {
        const file = dataUrlToFile(photoUrl, `${updates.name || 'photo'}.png`)
        if (file) photoUrl = await uploadImage(file, 'member')
        updates = { ...updates, photo: photoUrl }
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      )

      if (isAdmin) {
        const dbUpdates = memberToDb({ ...updates } as Omit<TeamMember, 'id'>)
        if (photoUrl !== undefined) dbUpdates.photo_url = photoUrl
        await supabase.from('team_members').update(dbUpdates).eq('id', id)
      }

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(members.map((m) => (m.id === id ? { ...m, ...updates } : m))),
        )
      } catch {
        // ignore
      }
    },
    [isAdmin, members],
  )

  const deleteMember = useCallback(
    async (id: string) => {
      const member = members.find((m) => m.id === id)
      if (member?.photo) {
        await removeImage(member.photo)
      }

      setMembers((prev) => prev.filter((m) => m.id !== id))

      if (isAdmin) {
        await supabase.from('team_members').delete().eq('id', id)
      }

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(members.filter((m) => m.id !== id)),
        )
      } catch {
        // ignore
      }
    },
    [isAdmin, members],
  )

  return { members, loaded, addMember, updateMember, deleteMember }
}
