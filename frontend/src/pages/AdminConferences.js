import React, { useState, useEffect } from 'react';
import { conferenceService } from '../services/api';

function AdminConferences({ user }) {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingConference, setEditingConference] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        date: '',
        description: '',
        img: '',
        content: '',
        duration: '',
        speakers: [{ firstname: '', lastname: '' }],
        design: { mainColor: '#61dafb', secondColor: '#282c34' }
    });

    useEffect(() => {
        loadConferences();
    }, []);

    const loadConferences = async () => {
        try {
            setLoading(true);
            const response = await conferenceService.getAllConferences();
            setConferences(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement conférences:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingConference) {
                await conferenceService.updateConference(editingConference.id, formData);
                alert('Modification réussie !');
            } else {
                const cleanData = {
                    id: `conf-${Date.now()}`,
                    title: formData.title,
                    date: formData.date,
                    description: formData.description,
                    img: formData.img || "https://via.placeholder.com/400x250",
                    content: formData.content,
                    duration: formData.duration,
                    speakers: [{ firstname: "Admin", lastname: "User" }],
                    design: formData.design
                };
                
                await conferenceService.createConference(cleanData);
                alert('Conférence créée !');
            }
            
            resetForm();
            setTimeout(() => loadConferences(), 500);
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'opération');
        }
    };

    const handleDelete = async (conferenceId) => {
        if (window.confirm('Supprimer cette conférence ?')) {
            try {
                await conferenceService.deleteConference(conferenceId);
                loadConferences();
                alert('Conférence supprimée !');
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: '',
            title: '',
            date: '',
            description: '',
            img: '',
            content: '',
            duration: '',
            speakers: [{ firstname: '', lastname: '' }],
            design: { mainColor: '#61dafb', secondColor: '#282c34' }
        });
        setShowForm(false);
        setEditingConference(null);
    };

    const startEdit = (conference) => {
        setFormData({
            id: conference.id,
            title: conference.title,
            date: conference.date,
            description: conference.description,
            img: conference.img,
            content: conference.content,
            duration: conference.duration,
            speakers: conference.speakers || [{ firstname: '', lastname: '' }],
            design: conference.design || { mainColor: '#61dafb', secondColor: '#282c34' }
        });
        setEditingConference(conference);
        setShowForm(true);
    };

    if (loading) return <div style={{ padding: '20px' }}>Chargement...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Administration des Conférences</h1>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h3>{editingConference ? 'Modifier' : 'Nouvelle'} Conférence</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Titre:</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        
                        <div>
                            <label>Date:</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        
                        <div>
                            <label>Durée:</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                placeholder="ex: 2h30"
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '15px' }}>
                        <label>Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            rows="3"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    
                    <div style={{ marginTop: '15px' }}>
                        <label>Contenu:</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows="6"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                        <button type="submit" style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            {editingConference ? 'Modifier' : 'Créer'}
                        </button>
                        
                        <button type="button" onClick={resetForm} style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Annuler
                        </button>
                    </div>
                </form>
            )}

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowForm(!showForm)} style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    {showForm ? 'Annuler' : 'Nouvelle Conférence'}
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                {conferences.map(conference => (
                    <div key={conference._id} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: 'white'
                    }}>
                        <h3>{conference.title}</h3>
                        <p><strong>Date:</strong> {conference.date}</p>
                        <p>{conference.description}</p>
                        
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button onClick={() => startEdit(conference)} style={{
                                backgroundColor: '#ffc107',
                                color: '#212529',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Modifier
                            </button>
                            
                            <button onClick={() => handleDelete(conference.id)} style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminConferences;

