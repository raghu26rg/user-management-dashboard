import type { SortDirection, SortField, User } from '../types/user'

interface UserTableProps {
  users: User[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  isLoading: boolean
}

const columns: Array<{ key: SortField; label: string }> = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
]

function SortIndicator({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField
  sortField: SortField
  sortDirection: SortDirection
}) {
  if (field !== sortField) {
    return <span className="text-slate-300">↕</span>
  }

  return <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
}

export default function UserTable({
  users,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  isLoading,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-white p-8">
        <p className="text-slate-500">Loading users...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-white p-8">
        <p className="text-slate-500">No users match your search or filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  <button
                    type="button"
                    onClick={() => onSort(key)}
                    className="inline-flex items-center gap-1 hover:text-indigo-600"
                  >
                    {label}
                    <SortIndicator
                      field={key}
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700">{user.id}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{user.firstName}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{user.lastName}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{user.department}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  ID {user.id}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-slate-500">Email:</dt>
                <dd className="text-slate-700">{user.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-slate-500">Department:</dt>
                <dd className="text-slate-700">{user.department}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
