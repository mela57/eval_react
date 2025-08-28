import React, { useState, useEffect } from 'react';
import { authService } from './services/api';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import ConferenceDetail from './pages/ConferenceDetail';
import AdminConferences from './pages/AdminConferences';
import AdminUsers from './pages/AdminUsers';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Utiliser la nouvelle fonction pour récupérer le vrai type d'utilisateur
        const userInfo = authService.getCurrentUser();
        if (userInfo) {
          setUser(userInfo);
        }
      }
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
    }
    setLoading(false);
  };

  initializeAuth();
}, []);
const handleLogin = (userId) => {
  // Après connexion réussie, récupérer les vraies infos utilisateur
  const userInfo = authService.getCurrentUser();
  if (userInfo) {
    setUser(userInfo);
  } else {
    // Fallback si on n'arrive pas à décoder le token
    setUser({ id: userId, type: 'user' });
  }
  setCurrentPage('home');
};

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedConferenceId(null);
  };

  const handleConferenceClick = (conferenceId) => {
    setSelectedConferenceId(conferenceId);
    setCurrentPage('conference-detail');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  return (
    <div className="App">
      <Navigation 
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'home' && (
          <Home onConferenceClick={handleConferenceClick} />
        )}
        
        {currentPage === 'login' && (
          <Login onLogin={handleLogin} />
        )}
        
        {currentPage === 'conference-detail' && (
          <ConferenceDetail 
            conferenceId={selectedConferenceId}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'admin-conferences' && user && user.type === 'admin' &&  (
            <AdminConferences />
        )}
        
        {currentPage === 'admin-users' && user && user.type === 'admin' && (
            <AdminUsers />
        )}

        {(currentPage === 'admin-conferences' || currentPage === 'admin-users') && (!user || user.type !== 'admin') && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Accès refusé</h2>
            <p>Vous devez être administrateur pour accéder à cette page.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;