import { useEffect, useState } from 'react'
import type { UserFormData } from '../types/user'
import { hasErrors, validateUserForm } from '../utils/validation'
import type { FormErrors } from '../utils/validation'

interface UserFormProps {
  initialData?: UserFormData
  title: string
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
}

const EMPTY_FORM: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
}

export default function UserForm({
  initialData,
  title,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [form, setForm] = useState<UserFormData>(initialData ?? EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof UserFormData, boolean>>>({})

  useEffect(() => {
    setForm(initialData ?? EMPTY_FORM)
    setErrors({})
    setTouched({})
  }, [initialData])

  const handleChange = (field: keyof UserFormData, value: string) => {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)
    if (touched[field]) {
      setErrors(validateUserForm(nextForm))
    }
  }

  const handleBlur = (field: keyof UserFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateUserForm(form))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const validationErrors = validateUserForm(form)
    setErrors(validationErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      department: true,
    })

    if (!hasErrors(validationErrors)) {
      onSubmit(form)
    }
  }

  const fields: Array<{ key: keyof UserFormData; label: string; type?: string }> = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'department', label: 'Department' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <h2 id="user-form-title" className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          {fields.map(({ key, label, type = 'text' }) => (
            <div key={key}>
              <label htmlFor={key} className="mb-1 block text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                id={key}
                type={type}
                value={form[key]}
                onChange={(event) => handleChange(key, event.target.value)}
                onBlur={() => handleBlur(key)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  errors[key]
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors[key] && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
