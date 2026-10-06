import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  const sessionExpiresAt = localStorage.getItem('session_expires_at')

  console.log('Token enviado:', token ? 'Sí' : 'No')

  if (sessionExpiresAt && Date.now() >= Number(sessionExpiresAt)) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('session_expires_at')

    window.location.href = '/'

    return Promise.reject(new Error('Sesión expirada'))
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestOriginal = error.config

    if (error.response?.status === 401 && !requestOriginal._retry) {
      requestOriginal._retry = true

      const sessionExpiresAt = localStorage.getItem('session_expires_at')

      if (sessionExpiresAt && Date.now() >= Number(sessionExpiresAt)) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('session_expires_at')

        window.location.href = '/'

        return Promise.reject(error)
      }

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('session_expires_at')

        window.location.href = '/'

        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          {
            refresh: refreshToken,
          },
        )

        localStorage.setItem('access_token', response.data.access)

        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh)
        }

        requestOriginal.headers.Authorization = `Bearer ${response.data.access}`

        return api(requestOriginal)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('session_expires_at')

        window.location.href = '/'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
