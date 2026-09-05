import api from './api';
import { Bill, PageResponse } from '@/types';

export const billService = {
  getAll: async (params?: any): Promise<PageResponse<Bill>> => {
    const response = await api.get<any>('/bills', { params });
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
    const response = await api.get<Bill>(`/bills/${id}`);
    return response.data;
  },
  create: async (data: Partial<Bill>) => {
    const response = await api.post<Bill>('/bills', data);
    return response.data;
  },
  updatePayment: async (id: number, data: { paymentStatus: string, paymentMethod: string }) => {
    const response = await api.put<Bill>(`/bills/${id}/payment`, null, { params: { method: data.paymentMethod } });
    return response.data;
  }
};
