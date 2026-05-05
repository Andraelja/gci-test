import axios from 'axios'
import { getAuth } from '@/hooks/useAuth'
import type { ApiResponse } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const { token } = getAuth()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiFetch = async <T>(url: string): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url)
  return response.data.data
}

export default api

