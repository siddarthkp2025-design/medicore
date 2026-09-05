import api from './api';
import { Department, PageResponse } from '@/types';

export const departmentService = {
  getAll: async (params?: any): Promise<PageResponse<Department>> => {
    const response = await api.get<any>('/departments', { params });
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
    const response = await api.get<Department>(`/departments/${id}`);
    return response.data;
  },
  create: async (data: Partial<Department>) => {
    const response = await api.post<Department>('/departments', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Department>) => {
    const response = await api.put<Department>(`/departments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/departments/${id}`);
  },
};
