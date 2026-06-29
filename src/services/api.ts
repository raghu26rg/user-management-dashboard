import axios from 'axios'
import type { User, UserFormData } from '../types/user'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users')
  return data
}

export async function createUser(form: UserFormData): Promise<User> {
  const { data } = await api.post<User>('/users', form)
  return data
}

export async function updateUser(id: number, form: UserFormData): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, form)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.'
    }
    if (!error.response) {
      return 'Network error. Please check your internet connection.'
    }

    const message = error.response.data?.message
    if (typeof message === 'string') {
      return message
    }

    return `Server error (${error.response.status}). Please try again later.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
