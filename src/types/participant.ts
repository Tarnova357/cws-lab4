export interface Participant {
  id: string
  name: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export type ParticipantFormData = Omit<Participant, 'id'>

export type SortField = 'name' | 'dateOfBirth' | null
export type SortDirection = 'asc' | 'desc'
