import { useCallback, useEffect, useMemo, useState } from 'react'
import FilterModal from './components/FilterModal'
import Pagination from './components/Pagination'
import UserForm from './components/UserForm'
import UserTable from './components/UserTable'
import {
  createUser,
  deleteUser,
  fetchUsers,
  getErrorMessage,
  updateUser,
} from './services/api'
import type { SortDirection, SortField, User, UserFilters, UserFormData } from './types/user'
import { EMPTY_FILTERS } from './types/user'
import {
  countActiveFilters,
  filterUsers,
  paginateUsers,
  searchUsers,
  sortUsers,
} from './utils/userList'

type ModalMode = 'add' | 'edit' | null

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<UserFilters>(EMPTY_FILTERS)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (!successMessage) return
    const timer = window.setTimeout(() => setSuccessMessage(null), 3000)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  const processedUsers = useMemo(() => {
    const searched = searchUsers(users, searchQuery)
    const filtered = filterUsers(searched, filters)
    return sortUsers(filtered, sortField, sortDirection)
  }, [users, searchQuery, filters, sortField, sortDirection])

  const totalPages = Math.ceil(processedUsers.length / pageSize) || 1

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedUsers = useMemo(
    () => paginateUsers(processedUsers, currentPage, pageSize),
    [processedUsers, currentPage, pageSize],
  )

  const activeFilterCount = countActiveFilters(filters)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortDirection('asc')
  }

  const handleAddUser = async (formData: UserFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const newUser = await createUser(formData)
      setUsers((prev) => [...prev, newUser])
      setSuccessMessage('User added successfully.')
      setModalMode(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async (formData: UserFormData) => {
    if (!selectedUser) return

    setIsSubmitting(true)
    setError(null)

    try {
      const updatedUser = await updateUser(selectedUser.id, formData)
      setUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? updatedUser : user)),
      )
      setSuccessMessage('User updated successfully.')
      setModalMode(null)
      setSelectedUser(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setIsSubmitting(true)
    setError(null)

    try {
      await deleteUser(userToDelete.id)
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id))
      setSuccessMessage('User deleted successfully.')
      setUserToDelete(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isLoading
                ? 'Loading users from database...'
                : `${users.length} users stored in SQLite database`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedUser(null)
              setModalMode('add')
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add User
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void loadUsers()}
                className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label htmlFor="search" className="sr-only">
                Search users
              </label>
              <input
                id="search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by name, email, department, or ID..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowFilterModal(true)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters(EMPTY_FILTERS)
                    setCurrentPage(1)
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <UserTable
            users={paginatedUsers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={(user) => {
              setSelectedUser(user)
              setModalMode('edit')
            }}
            onDelete={setUserToDelete}
            isLoading={isLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={processedUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />
        </section>
      </main>

      {modalMode === 'add' && (
        <UserForm
          title="Add User"
          submitLabel="Add User"
          isSubmitting={isSubmitting}
          onSubmit={handleAddUser}
          onCancel={() => setModalMode(null)}
        />
      )}

      {modalMode === 'edit' && selectedUser && (
        <UserForm
          title="Edit User"
          submitLabel="Save Changes"
          initialData={{
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            department: selectedUser.department,
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleEditUser}
          onCancel={() => {
            setModalMode(null)
            setSelectedUser(null)
          }}
        />
      )}

      {showFilterModal && (
        <FilterModal
          filters={filters}
          onApply={(nextFilters) => {
            setFilters(nextFilters)
            setCurrentPage(1)
            setShowFilterModal(false)
          }}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-slate-900">Delete User</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{' '}
              <span className="font-medium text-slate-900">
                {userToDelete.firstName} {userToDelete.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteUser()}
                disabled={isSubmitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
