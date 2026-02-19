import axios from 'axios';
import type {
  AdminAuthResponse,
  AdminUser,
  CurrentAdminResponse,
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
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const adminLogin = async (username: string, password: string) => {
  const response = await api.post<AdminAuthResponse>('/auth/login', { username, password });
  return response;
};

export const adminLogoutRequest = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getCurrentAdmin = () => {
  return api.get<CurrentAdminResponse>('/auth/me');
};

// Participant endpoints
export const submitForm = (formData: Record<string, string>) => {
  return api.post<SubmitFormResponse>('/participants/submit', { formData });
};

export const getPublicFormFields = () => {
  return api.get<FormField[]>('/participants/fields');
};

export const getParticipants = () => {
  return api.get<Participant[]>('/participants');
};

export const getParticipantCount = () => {
  return api.get<{ count: number }>('/participants/count');
};

// Admin endpoints
export const getAdminFormFields = () => {
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

export const getAdminUsers = () => {
  return api.get<AdminUser[]>('/admin/users');
};

export const createAdminUser = (username: string, password: string) => {
  return api.post<AdminUser>('/admin/users', { username, password });
};

export const deleteAdminUser = (id: string) => {
  return api.delete<{ message: string }>(`/admin/users/${id}`);
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
