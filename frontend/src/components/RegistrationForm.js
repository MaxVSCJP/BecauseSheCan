import React, { useState, useEffect } from 'react';
import { submitForm, getFormFields } from '../services/api';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFormFields();
  }, []);

  const loadFormFields = async () => {
    try {
      const response = await getFormFields();
      setFormFields(response.data);
    } catch (error) {
      console.error('Error loading form fields:', error);
      setError('Failed to load form fields');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await submitForm(formData);
      setAvatar(response.data.participant.avatar);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>✅ Registration Successful!</h2>
          <p>Thank you for joining Because She Can!</p>
          <div className="avatar-container">
            <h3>Your Avatar:</h3>
            <img src={avatar} alt="Your Avatar" className="avatar" />
          </div>
          <p className="raffle-message">You've been entered into the raffle! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Because She Can</h1>
        <p className="subtitle">Empowering Women in Tech</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {formFields.map(field => (
            <div key={field._id} className="form-group">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="form-input"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  {field.options && field.options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="form-input"
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
