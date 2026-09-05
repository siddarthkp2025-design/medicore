import api from './api';
import { Patient, PageResponse } from '@/types';

export const patientService = {
  getAll: async (params?: any): Promise<PageResponse<Patient>> => {
    const response = await api.get<any>('/patients', { params });
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        page: 0,
        size: response.data.length,
        totalElements: response.data.length,
        totalPages: 1,
      };
    }
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },
  getCurrentPatient: async () => {
    const response = await api.get<Patient>('/patients/me');
    return response.data;
  },
  create: async (data: Partial<Patient>) => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Patient>) => {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/patients/${id}`);
  },
};
