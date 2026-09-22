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
  create: async (data: any) => {
    const payload: any = {
      admissionDate: data.admissionDate,
      expectedDischargeDate: data.expectedDischargeDate,
      diagnosis: data.diagnosis,
      status: data.status,
    };
    if (data.patientId) payload.patient = { id: Number(data.patientId) };
    if (data.patient) payload.patient = data.patient;

    if (data.roomId) payload.room = { id: Number(data.roomId) };
    if (data.room) payload.room = data.room;

    if (data.doctorId) payload.doctor = { id: Number(data.doctorId) };
    if (data.doctor) payload.doctor = data.doctor;

    const response = await api.post<Admission>('/admissions', payload);
    return response.data;
  },
  discharge: async (id: number) => {
    const response = await api.put<Admission>(`/admissions/${id}/discharge`, {});
    return response.data;
  },
};
