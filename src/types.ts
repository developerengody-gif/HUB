export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string | null
  email: string
  linkedin: string
  github: string
  website: string
}

export const emptyMember = (): Omit<TeamMember, 'id'> => ({
  name: '',
  role: '',
  bio: '',
  photo: null,
  email: '',
  linkedin: '',
  github: '',
  website: '',
})
