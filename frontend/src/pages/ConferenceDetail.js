import React, { useState, useEffect } from 'react';
import { conferenceService } from '../services/api';

function ConferenceDetail({ conferenceId, onBack }) {
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConference = async () => {
      try {
        const response = await conferenceService.getConferenceById(conferenceId);
        setConference(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement conférence:', error);
        setLoading(false);
      }
    };
    
    if (conferenceId) {
      loadConference();
    }
  }, [conferenceId]);

  if (loading) return <div>Chargement...</div>;
  if (!conference) return <div>Conférence non trouvée</div>;

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: conference.design?.secondColor || '#f5f5f5',
      color: conference.design?.mainColor || '#333'
    }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Retour à la liste
      </button>
      
      <h1>{conference.title}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          <p><strong>Description :</strong></p>
          <p>{conference.description}</p>
          
          <p><strong>Contenu :</strong></p>
          <p>{conference.content}</p>
        </div>
        
        <div>
          <p><strong>Date :</strong> {conference.date}</p>
          <p><strong>Durée :</strong> {conference.duration}</p>
          
          {conference.speakers && (
            <div>
              <p><strong>Intervenants :</strong></p>
              <ul>
                {conference.speakers.map((speaker, index) => (
                  <li key={index}>{speaker.firstname} {speaker.lastname}</li>
                ))}
              </ul>
            </div>
          )}
          
          {conference.osMap && (
            <div>
              <p><strong>Lieu :</strong></p>
              <p>{conference.osMap.addressl1}</p>
              <p>{conference.osMap.city}, {conference.osMap.postalCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConferenceDetail;