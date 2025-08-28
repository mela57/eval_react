import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setError('Impossible de charger les utilisateurs');
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId) => {
    if (window.confirm('Promouvoir cet utilisateur en administrateur ?')) {
      try {
        await userService.changeUserType(userId, 'admin');
        loadUsers(); // Recharger la liste
        alert('Utilisateur promu avec succès');
      } catch (error) {
        console.error('Erreur promotion:', error);
        alert('Erreur lors de la promotion');
      }
    }
  };

  const handleDemoteUser = async (userId) => {
    if (window.confirm('Rétrograder cet administrateur en utilisateur simple ?')) {
      try {
        await userService.changeUserType(userId, 'user');
        loadUsers(); // Recharger la liste
        alert('Utilisateur rétrogradé avec succès');
      } catch (error) {
        console.error('Erreur rétrogradation:', error);
        alert('Erreur lors de la rétrogradation');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      try {
        await userService.deleteUser(userId);
        loadUsers(); // Recharger la liste
        alert('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Chargement des utilisateurs...</div>;
  
  if (error) return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>Erreur</h2>
      <p>{error}</p>
      <button onClick={loadUsers}>Réessayer</button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Administration des Utilisateurs</h1>
      <p>Total: {users.length} utilisateur(s)</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {users.map(user => (
          <div key={user._id || user.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: user.type === 'admin' ? '#e8f5e8' : '#f8f9fa'
          }}>
            <h3>{user.id}</h3>
            <p>
              <strong>Type:</strong> 
              <span style={{
                color: user.type === 'admin' ? '#28a745' : '#6c757d',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {user.type === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </p>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {user.type === 'user' ? (
                <button 
                  onClick={() => handlePromoteUser(user.id)}
                  style={{ 
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Promouvoir Admin
                </button>
              ) : (
                <button 
                  onClick={() => handleDemoteUser(user.id)}
                  style={{ 
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Rétrograder User
                </button>
              )}
              
              <button 
                onClick={() => handleDeleteUser(user.id)}
                style={{ 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;