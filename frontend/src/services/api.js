import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Participant endpoints
export const submitForm = (formData) => {
  return api.post('/participants/submit', { formData });
};

export const getParticipants = () => {
  return api.get('/participants');
};

export const getParticipantCount = () => {
  return api.get('/participants/count');
};

// Admin endpoints
export const getFormFields = () => {
  return api.get('/admin/fields');
};

export const createFormField = (field) => {
  return api.post('/admin/fields', field);
};

export const updateFormField = (id, field) => {
  return api.put(`/admin/fields/${id}`, field);
};

export const deleteFormField = (id) => {
  return api.delete(`/admin/fields/${id}`);
};

export const getRaffleSettings = () => {
  return api.get('/admin/raffle');
};

export const updateRaffleSettings = (settings) => {
  return api.put('/admin/raffle', settings);
};

export const getAdminParticipants = () => {
  return api.get('/admin/participants');
};

// Raffle endpoints
export const getRaffleInfo = () => {
  return api.get('/raffle/info');
};

export const drawWinners = () => {
  return api.post('/raffle/draw');
};

export const getWinners = () => {
  return api.get('/raffle/winners');
};

export default api;
