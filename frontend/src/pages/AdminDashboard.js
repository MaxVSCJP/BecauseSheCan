import React, { useState, useEffect } from 'react';
import {
  getFormFields,
  createFormField,
  updateFormField,
  deleteFormField,
  getRaffleSettings,
  updateRaffleSettings,
  getAdminParticipants,
  drawWinners,
  getWinners
} from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [formFields, setFormFields] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [raffleSettings, setRaffleSettings] = useState({
    prize: '',
    description: '',
    numberOfWinners: 1
  });
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    options: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'fields') {
        const response = await getFormFields();
        setFormFields(response.data);
      } else if (activeTab === 'raffle') {
        const settingsRes = await getRaffleSettings();
        setRaffleSettings(settingsRes.data);
        const winnersRes = await getWinners();
        setWinners(winnersRes.data);
      } else if (activeTab === 'participants') {
        const response = await getAdminParticipants();
        setParticipants(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('Failed to load data', 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      const fieldData = {
        ...newField,
        options: newField.options ? newField.options.split(',').map(o => o.trim()) : []
      };
      await createFormField(fieldData);
      showMessage('Field added successfully');
      setNewField({ name: '', label: '', type: 'text', required: false, options: '' });
      loadData();
    } catch (error) {
      console.error('Error adding field:', error);
      showMessage('Failed to add field', 'error');
    }
  };

  const handleDeleteField = async (id) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await deleteFormField(id);
        showMessage('Field deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting field:', error);
        showMessage('Failed to delete field', 'error');
      }
    }
  };

  const handleUpdateRaffle = async (e) => {
    e.preventDefault();
    try {
      await updateRaffleSettings(raffleSettings);
      showMessage('Raffle settings updated successfully');
    } catch (error) {
      console.error('Error updating raffle settings:', error);
      showMessage('Failed to update raffle settings', 'error');
    }
  };

  const handleDrawWinners = async () => {
    if (window.confirm('Are you sure you want to draw winners? This cannot be undone.')) {
      try {
        const response = await drawWinners();
        showMessage(response.data.message);
        loadData();
      } catch (error) {
        console.error('Error drawing winners:', error);
        showMessage(error.response?.data?.error || 'Failed to draw winners', 'error');
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Because She Can - Management Console</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button
          className={activeTab === 'fields' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('fields')}
        >
          Form Fields
        </button>
        <button
          className={activeTab === 'raffle' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('raffle')}
        >
          Raffle Settings
        </button>
        <button
          className={activeTab === 'participants' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('participants')}
        >
          Participants
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'fields' && (
          <div>
            <h2>Manage Form Fields</h2>
            <form onSubmit={handleAddField} className="add-field-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Field Name (e.g., email)"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Field Label (e.g., Email Address)"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  required
                />
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>
              {newField.type === 'select' && (
                <input
                  type="text"
                  placeholder="Options (comma-separated)"
                  value={newField.options}
                  onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                />
              )}
              <div className="form-row">
                <label>
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  />
                  Required
                </label>
                <button type="submit">Add Field</button>
              </div>
            </form>

            <div className="fields-list">
              <h3>Current Fields</h3>
              {formFields.length === 0 ? (
                <p>No fields configured yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Label</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formFields.map(field => (
                      <tr key={field._id}>
                        <td>{field.name}</td>
                        <td>{field.label}</td>
                        <td>{field.type}</td>
                        <td>{field.required ? 'Yes' : 'No'}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteField(field._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'raffle' && (
          <div>
            <h2>Raffle Settings</h2>
            <form onSubmit={handleUpdateRaffle} className="raffle-form">
              <div className="form-group">
                <label>Prize Name</label>
                <input
                  type="text"
                  value={raffleSettings.prize}
                  onChange={(e) => setRaffleSettings({ ...raffleSettings, prize: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prize Description</label>
                <textarea
                  value={raffleSettings.description}
                  onChange={(e) => setRaffleSettings({ ...raffleSettings, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Number of Winners</label>
                <input
                  type="number"
                  min="1"
                  value={raffleSettings.numberOfWinners}
                  onChange={(e) => setRaffleSettings({ ...raffleSettings, numberOfWinners: parseInt(e.target.value) })}
                  required
                />
              </div>
              <button type="submit">Update Settings</button>
            </form>

            <div className="raffle-actions">
              <h3>Draw Winners</h3>
              <p>Total Participants: {participants.length}</p>
              <button onClick={handleDrawWinners} className="draw-btn">
                Draw {raffleSettings.numberOfWinners} Winner(s)
              </button>
            </div>

            {winners.length > 0 && (
              <div className="winners-list">
                <h3>Winners</h3>
                {winners.map(winner => (
                  <div key={winner._id} className="winner-card">
                    <img src={winner.avatar} alt="Winner Avatar" />
                    <div>
                      <p><strong>Submitted:</strong> {new Date(winner.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h2>Participants ({participants.length})</h2>
            <div className="participants-grid">
              {participants.map(participant => (
                <div key={participant._id} className="participant-card">
                  <img src={participant.avatar} alt="Participant Avatar" />
                  <div className="participant-info">
                    {Object.entries(participant.formData).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                    <p><small>Submitted: {new Date(participant.submittedAt).toLocaleString()}</small></p>
                    {participant.hasWon && <span className="winner-badge">🎉 Winner!</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
