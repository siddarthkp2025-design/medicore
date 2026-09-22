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
  create: async (data: any) => {
    const payload: any = {
      prescriptionDate: data.prescriptionDate,
      notes: data.notes,
    };
    if (data.patientId) payload.patient = { id: Number(data.patientId) };
    if (data.patient) payload.patient = data.patient;

    if (data.doctorId) payload.doctor = { id: Number(data.doctorId) };
    if (data.doctor) payload.doctor = data.doctor;

    if (data.recordId && Number(data.recordId) > 0 && !Number.isNaN(Number(data.recordId))) {
      payload.medicalRecord = { id: Number(data.recordId) };
    }
    if (data.medicalRecord && data.medicalRecord.id) {
      payload.medicalRecord = data.medicalRecord;
    }

    if (Array.isArray(data.items)) {
      payload.items = data.items.map((item: any) => ({
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
        medicine: item.medicine ?? (item.medicineId ? { id: Number(item.medicineId) } : undefined),
      }));
    }

    const response = await api.post<Prescription>('/prescriptions', payload);
    return response.data;
  }
};
