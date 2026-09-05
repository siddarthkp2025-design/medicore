import api from './api';
import { Medicine, PageResponse } from '@/types';

export const medicineService = {
  getAll: async (params?: any): Promise<PageResponse<Medicine>> => {
    const response = await api.get<any>('/medicines', { params });
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
    const response = await api.get<Medicine>(`/medicines/${id}`);
    return response.data;
  },
  create: async (data: Partial<Medicine>) => {
    const response = await api.post<Medicine>('/medicines', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Medicine>) => {
    const response = await api.put<Medicine>(`/medicines/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/medicines/${id}`);
  },
  getLowStock: async () => {
    const response = await api.get<Medicine[]>('/medicines/low-stock');
    return response.data;
  },
  getExpiring: async () => {
    const response = await api.get<Medicine[]>('/medicines/expiring');
    return response.data;
  }
};
