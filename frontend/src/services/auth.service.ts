import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest) => {
    const response = await api.post<{ message: string; username: string }>('/auth/register', data);
    return response.data;
  },
};
