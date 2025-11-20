import axios from 'axios'
import useAuthStore from '@/stores/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState()

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/refresh`,
          {},
          {
            withCredentials: true,
          },
        )

        const newAccessToken = data.token

        useAuthStore.getState().setToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token expired:', refreshError)

        useAuthStore.getState().logout()
        window.location.href = '/'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
