import axios from 'axios';
import type {
  FormField,
  Participant,
  RaffleSettings,
  SubmitFormResponse,
  RaffleInfo,
  DrawWinnersResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Participant endpoints
export const submitForm = (formData: Record<string, string>) => {
  return api.post<SubmitFormResponse>('/participants/submit', { formData });
};

export const getParticipants = () => {
  return api.get<Participant[]>('/participants');
};

export const getParticipantCount = () => {
  return api.get<{ count: number }>('/participants/count');
};

// Admin endpoints
export const getFormFields = () => {
  return api.get<FormField[]>('/admin/fields');
};

export const createFormField = (field: Omit<FormField, '_id' | 'createdAt' | 'updatedAt'>) => {
  return api.post<FormField>('/admin/fields', field);
};

export const updateFormField = (id: string, field: Partial<FormField>) => {
  return api.put<FormField>(`/admin/fields/${id}`, field);
};

export const deleteFormField = (id: string) => {
  return api.delete<{ message: string }>(`/admin/fields/${id}`);
};

export const getRaffleSettings = () => {
  return api.get<RaffleSettings>('/admin/raffle');
};

export const updateRaffleSettings = (settings: Partial<RaffleSettings>) => {
  return api.put<RaffleSettings>('/admin/raffle', settings);
};

export const getAdminParticipants = () => {
  return api.get<Participant[]>('/admin/participants');
};

// Raffle endpoints
export const getRaffleInfo = () => {
  return api.get<RaffleInfo>('/raffle/info');
};

export const drawWinners = () => {
  return api.post<DrawWinnersResponse>('/raffle/draw');
};

export const getWinners = () => {
  return api.get<Participant[]>('/raffle/winners');
};

export default api;
