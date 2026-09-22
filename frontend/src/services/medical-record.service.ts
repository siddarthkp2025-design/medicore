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
  create: async (data: any) => {
    // Backend @ManyToOne entities need nested objects: { patient: {id}, doctor: {id} }
    const payload: any = {
      visitDate: data.visitDate,
      symptoms:  data.symptoms,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      notes:     data.notes,
    };
    if (data.patientId) payload.patient = { id: Number(data.patientId) };
    if (data.doctorId)  payload.doctor  = { id: Number(data.doctorId) };
    // Support already-nested format passthrough
    if (data.patient)   payload.patient = data.patient;
    if (data.doctor)    payload.doctor  = data.doctor;

    const response = await api.post<MedicalRecord>('/medical-records', payload);
    return response.data;
  },
  update: async (id: number, data: Partial<MedicalRecord>) => {
    const response = await api.put<MedicalRecord>(`/medical-records/${id}`, data);
    return response.data;
  },
};
