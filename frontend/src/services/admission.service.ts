import api from './api';
import { Admission, PageResponse } from '@/types';

export const admissionService = {
  getAll: async (params?: any): Promise<PageResponse<Admission>> => {
    const response = await api.get<any>('/admissions', { params });
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
    const response = await api.get<Admission>(`/admissions/${id}`);
    return response.data;
  },
  create: async (data: Partial<Admission>) => {
    const response = await api.post<Admission>('/admissions', data);
    return response.data;
  },
  discharge: async (id: number) => {
    const response = await api.put<Admission>(`/admissions/${id}/discharge`, {});
    return response.data;
  },
};
