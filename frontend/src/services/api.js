import axios from 'axios'
import { useAuthStore } from '../store/authStore.js'

const apiBase = import.meta.env.VITE_API_URL || ''

// axios instance để gọi REST API
export const api = axios.create({
  baseURL: apiBase || '', // nếu dev dùng proxy thì để '' cũng được
})

// Gắn JWT vào Authorization header cho mọi request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

