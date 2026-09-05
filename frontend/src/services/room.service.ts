import api from './api';
import { Room, PageResponse } from '@/types';

export const roomService = {
  getAll: async (params?: any): Promise<PageResponse<Room>> => {
    const response = await api.get<any>('/rooms', { params });
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
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },
  create: async (data: Partial<Room>) => {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Room>) => {
    const response = await api.put<Room>(`/rooms/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/rooms/${id}`);
  },
};
