import api from './api';
import { MedicalRecord, PageResponse } from '@/types';

export const medicalRecordService = {
  getAll: async (params?: any): Promise<PageResponse<MedicalRecord>> => {
    const response = await api.get<any>('/medical-records', { params });
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
    const response = await api.get<MedicalRecord>(`/medical-records/${id}`);
    return response.data;
  },
  create: async (data: Partial<MedicalRecord>) => {
    const response = await api.post<MedicalRecord>('/medical-records', data);
    return response.data;
  },
  update: async (id: number, data: Partial<MedicalRecord>) => {
    const response = await api.put<MedicalRecord>(`/medical-records/${id}`, data);
    return response.data;
  },
};
