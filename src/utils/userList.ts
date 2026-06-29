import type { SortDirection, SortField, User, UserFilters } from '../types/user'

export function filterUsers(users: User[], filters: UserFilters): User[] {
  return users.filter((user) => {
    const firstNameMatch =
      !filters.firstName ||
      user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
    const lastNameMatch =
      !filters.lastName ||
      user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
    const emailMatch =
      !filters.email ||
      user.email.toLowerCase().includes(filters.email.toLowerCase())
    const departmentMatch =
      !filters.department ||
      user.department.toLowerCase().includes(filters.department.toLowerCase())

    return firstNameMatch && lastNameMatch && emailMatch && departmentMatch
  })
}

export function searchUsers(users: User[], query: string): User[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return users

  return users.filter((user) =>
    [user.id, user.firstName, user.lastName, user.email, user.department]
      .join(' ')
      .toLowerCase()
      .includes(normalized),
  )
}

export function sortUsers(
  users: User[],
  field: SortField,
  direction: SortDirection,
): User[] {
  const sorted = [...users].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue
    }

    return String(aValue).localeCompare(String(bValue), undefined, {
      sensitivity: 'base',
    })
  })

  return direction === 'asc' ? sorted : sorted.reverse()
}

export function paginateUsers<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function countActiveFilters(filters: UserFilters): number {
  return Object.values(filters).filter((value) => value.trim() !== '').length
}
