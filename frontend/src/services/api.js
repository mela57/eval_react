import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:4555';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajout token 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service pour les conférences
export const conferenceService = {
  getAllConferences: () => api.get('/conferences'),
  getConferenceById: (id) => api.get(`/conference/${id}`),
  createConference: (conferenceData) => api.post('/conference', conferenceData),
  updateConference: (id, conferenceData) => api.patch(`/conference/${id}`, conferenceData),
  deleteConference: (id) => api.delete(`/conference/${id}`)
};

// Service auth
export const authService = {
  // Connexion
  login: (credentials) => api.post('/login', credentials),
  // Inscription
  register: (userData) => api.post('/signup', userData),
  // Vérifie si l'utilisateur est admin
  isAdmin: () => api.get('/isadmin'),
  // Récupére les infos de l'utilisateur connecté depuis le token
  getCurrentUser: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        return { id: payload._id, type: payload.type };
      } catch (error) {
        return null;
      }
    }
    return null;
  }
};

// Service  utilisateurs
export const userService = {
  getAllUsers: () => api.get('/users'),
  changeUserType: (userId, newType) => api.patch(`/usertype/${userId}`, { newType }),
  deleteUser: (userId) => api.delete(`/user/${userId}`),
  changePassword: (oldPassword, password) => api.patch('/userpassword', { oldPassword, password })
};

export default api;