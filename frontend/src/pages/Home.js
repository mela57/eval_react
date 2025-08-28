import React, { useState, useEffect } from 'react';
import { conferenceService } from '../services/api';

function Home({ onConferenceClick }) {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConferences = async () => {
      try {
        const response = await conferenceService.getAllConferences();
        setConferences(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement conférences:', error);
        setLoading(false);
      }
    };
    loadConferences();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Chargement...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Toutes les Conférences ({conferences.length})</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {conferences.map(conference => (
          <div 
            key={conference._id || conference.id} 
            onClick={() => onConferenceClick(conference.id)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: conference.design?.mainColor || '#333',
              margin: '0 0 10px 0'
            }}>
              {conference.title}
            </h3>
            
            <p><strong>Date:</strong> {conference.date}</p>
            <p>{conference.description}</p>
            
            {conference.speakers && conference.speakers.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Intervenants:</strong>
                <ul style={{ margin: '5px 0' }}>
                  {conference.speakers.map((speaker, index) => (
                    <li key={index}>
                      {speaker.firstname} {speaker.lastname}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;