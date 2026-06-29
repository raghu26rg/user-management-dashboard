export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  department: string
}

export interface UserFilters {
  firstName: string
  lastName: string
  email: string
  department: string
}

export type SortField = keyof User
export type SortDirection = 'asc' | 'desc'

export const EMPTY_FILTERS: UserFilters = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
}
