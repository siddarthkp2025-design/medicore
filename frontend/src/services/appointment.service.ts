import api from './api';
import { Appointment, PageResponse } from '@/types';

export const appointmentService = {
  getAll: async (params?: any): Promise<PageResponse<Appointment>> => {
    const response = await api.get<any>('/appointments', { params });
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
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },
  create: async (data: Partial<Appointment>) => {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Appointment>) => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.put<Appointment>(`/appointments/${id}/status`, null, { params: { status } });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/appointments/${id}`);
  },
};
