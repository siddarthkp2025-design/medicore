import api from './api';
import { Doctor, PageResponse } from '@/types';

export const doctorService = {
  getAll: async (params?: any): Promise<PageResponse<Doctor>> => {
    const response = await api.get<any>('/doctors', { params });
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
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },
  create: async (data: Partial<Doctor>) => {
    const response = await api.post<Doctor>('/doctors', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Doctor>) => {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/doctors/${id}`);
  },
};
