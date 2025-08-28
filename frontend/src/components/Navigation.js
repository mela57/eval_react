import React from 'react';

function Navigation({ user, onLogout, onNavigate, currentPage }) {
  return (
    <nav style={{ 
      backgroundColor: '#282c34', 
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <button 
          onClick={() => onNavigate('home')}
          style={{ 
            backgroundColor: currentPage === 'home' ? '#61dafb' : 'transparent',
            color: currentPage === 'home' ? '#282c34' : 'white',
            border: '1px solid #61dafb',
            padding: '8px 15px',
            marginRight: '10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Accueil
        </button>
        
        {user && user.type === 'admin' && (
          <>
            <button 
              onClick={() => onNavigate('admin-conferences')}
              style={{ 
                backgroundColor: currentPage === 'admin-conferences' ? '#61dafb' : 'transparent',
                color: currentPage === 'admin-conferences' ? '#282c34' : 'white',
                border: '1px solid #61dafb',
                padding: '8px 15px',
                marginRight: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Admin Conférences
            </button>
            
            <button 
              onClick={() => onNavigate('admin-users')}
              style={{ 
                backgroundColor: currentPage === 'admin-users' ? '#61dafb' : 'transparent',
                color: currentPage === 'admin-users' ? '#282c34' : 'white',
                border: '1px solid #61dafb',
                padding: '8px 15px',
                marginRight: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Admin Utilisateurs
            </button>
          </>
        )}
      </div>

      <div style={{ color: 'white' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Connecté: {user.id} ({user.type})</span>
            <button 
              onClick={onLogout}
              style={{ 
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('login')}
            style={{ 
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;