import { useEffect, useState } from 'react'
import type { UserFilters } from '../types/user'
import { EMPTY_FILTERS } from '../types/user'

interface FilterModalProps {
  filters: UserFilters
  onApply: (filters: UserFilters) => void
  onClose: () => void
}

export default function FilterModal({ filters, onApply, onClose }: FilterModalProps) {
  const [draft, setDraft] = useState<UserFilters>(filters)

  useEffect(() => {
    setDraft(filters)
  }, [filters])

  const fields: Array<{ key: keyof UserFilters; label: string }> = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        <h2 id="filter-title" className="text-xl font-semibold text-slate-900">
          Filter Users
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Narrow the list by matching partial text in each field.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={`filter-${key}`} className="mb-1 block text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                id={`filter-${key}`}
                type="text"
                value={draft[key]}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, [key]: event.target.value }))
                }
                placeholder={`Filter by ${label.toLowerCase()}`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => setDraft(EMPTY_FILTERS)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
