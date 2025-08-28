import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:4555';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Service pour les conférences
export const conferenceService = {
  // Récupérer toutes les conférences
  getAllConferences: () => api.get('/conferences'),
  
  // Récupérer une conférence par ID
  getConferenceById: (id) => api.get(`/conference/${id}`),
  
  // Créer une nouvelle conférence (admin seulement)
  createConference: (conferenceData) => api.post('/conference', { conference: conferenceData }),
  
  // Modifier une conférence (admin seulement)
  updateConference: (id, conferenceData) => api.patch(`/conference?id=${id}`, { conference: conferenceData }),
  
  // Supprimer une conférence (admin seulement)
  deleteConference: (id) => api.delete(`/conference?id=${id}`)
};

// Service pour l'authentification
export const authService = {
  // Connexion
  login: (credentials) => api.post('/login', credentials),
  
  // Inscription
  register: (userData) => api.post('/signup', userData),
  
  // Vérifier si l'utilisateur est admin
  isAdmin: () => api.get('/isadmin'),
  
  // Récupérer les infos de l'utilisateur connecté depuis le token
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

// Service pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: () => api.get('/users'),
  
  // Promouvoir un utilisateur en admin
  changeUserType: (userId, newType) => api.patch(`/usertype?id=${userId}`, { newType }),
  
  // Supprimer un utilisateur
  deleteUser: (userId) => api.delete(`/user?id=${userId}`),
  
  // Changer le mot de passe
  changePassword: (oldPassword, password) => api.patch('/userpassword', { oldPassword, password })
};

export default api;