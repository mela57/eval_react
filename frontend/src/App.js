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
        
        if (!token) {
          // creation compte admin et user 
          console.log('Création des comptes utilisateurs...');
          
          try {
            await authService.register({ id: 'admin', password: 'admin' });
            console.log('Compte admin créé');
          } catch (err) {
            console.log('Compte admin existe déjà');
          }
          
          try {
            await authService.register({ id: 'user', password: 'user' });
            console.log('Compte user créé');
          } catch (err) {
            console.log('Compte user existe déjà');
          }
          
          // Connexion admin par défaut
          const loginResponse = await authService.login({ id: 'admin', password: 'admin' });
          localStorage.setItem('authToken', loginResponse.data);
        }
        
        const userInfo = authService.getCurrentUser();
        if (userInfo) {
          setUser(userInfo);
        }
        
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userId) => {
    const userInfo = authService.getCurrentUser();
    if (userInfo) {
      setUser(userInfo);
    } else {
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
        
{currentPage === 'admin-conferences' && user && user.type === 'admin' && (
  <AdminConferences user={user} />
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