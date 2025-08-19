import axios from 'axios'

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
}

// Instance axios principale
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      // Optionnel : rediriger vers la page de connexion
      window.location.reload()
    }
    return Promise.reject(error)
  },
)

// Fonction utilitaire pour construire les URLs d'API
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_CONFIG.BASE_URL}${cleanEndpoint}`
}

// Fonction pour vérifier si on est en mode local
export const isLocalMode = (): boolean => {
  return API_CONFIG.APP_ENV === 'localhost' || API_CONFIG.BASE_URL.includes('localhost')
}

// Configuration par défaut pour fetch (alternative à axios)
export const getDefaultFetchOptions = (): RequestInit => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  }
}

// Fonction pour ajouter le token d'authentification aux options fetch
export const getAuthenticatedFetchOptions = (additionalOptions: RequestInit = {}): RequestInit => {
  const authToken = localStorage.getItem('authToken')
  const defaultOptions = getDefaultFetchOptions()

  return {
    ...defaultOptions,
    ...additionalOptions,
    headers: {
      ...defaultOptions.headers,
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...(additionalOptions.headers || {}),
    },
  }
}

// Services API utilisant axios
export const apiService = {
  // Authentification
  auth: {
    login: (credentials: { email: string; motDePasse: string }) =>
      api.post('/utilisateurs/connexion', credentials),
    register: (userData: { nomUtilisateur: string; email: string; motDePasse: string }) =>
      api.post('/utilisateurs/inscription', userData),
  },

  // Utilisateurs
  users: {
    getAll: () => api.get('/utilisateurs'),
    getById: (id: number) => api.get(`/utilisateurs/${id}`),
  },

  // Dépenses
  expenses: {
    getAll: () => api.get('/depenses'),
    getByUser: (userId: number) => api.get(`/depenses/utilisateur/${userId}`),
    create: (
      userId: number,
      expense: { montant: number; description: string; dateDepense: string },
    ) => api.post(`/depenses/utilisateur/${userId}`, expense),
    delete: (id: number) => api.delete(`/depenses/${id}`),
  },
}

export default api
