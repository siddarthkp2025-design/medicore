import api from './api';
import { Prescription, PageResponse } from '@/types';

export const prescriptionService = {
  getAll: async (params?: any): Promise<PageResponse<Prescription>> => {
    const response = await api.get<any>('/prescriptions', { params });
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
    const response = await api.get<Prescription>(`/prescriptions/${id}`);
    return response.data;
  },
  create: async (data: Partial<Prescription>) => {
    const response = await api.post<Prescription>('/prescriptions', data);
    return response.data;
  }
};
