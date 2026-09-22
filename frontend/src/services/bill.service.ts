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
  create: async (data: any) => {
    const payload: any = {
      consultationCharge: data.consultationCharge,
      roomCharge: data.roomCharge,
      medicineCharge: data.medicineCharge,
      otherCharges: data.otherCharges,
      discount: data.discount,
      tax: data.tax,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      billingDate: data.billingDate,
      items: data.items,
    };
    if (data.patientId) payload.patient = { id: Number(data.patientId) };
    if (data.patient) payload.patient = data.patient;

    if (data.appointmentId) payload.appointment = { id: Number(data.appointmentId) };
    if (data.appointment) payload.appointment = data.appointment;

    if (data.admissionId) payload.admission = { id: Number(data.admissionId) };
    if (data.admission) payload.admission = data.admission;

    const response = await api.post<Bill>('/bills', payload);
    return response.data;
  },
  updatePayment: async (id: number, data: { paymentStatus: string, paymentMethod: string }) => {
    const response = await api.put<Bill>(`/bills/${id}/payment`, null, { params: { method: data.paymentMethod } });
    return response.data;
  }
};
