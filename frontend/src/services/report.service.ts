import api from './api';
import { AdminDashboardStats, DoctorDashboardStats, PatientDashboardStats } from '@/types';

export const reportService = {
  getAdminDashboard: async () => {
    const response = await api.get<AdminDashboardStats>('/reports/dashboard/admin');
    return response.data;
  },
  getDoctorDashboard: async () => {
    const response = await api.get<DoctorDashboardStats>('/reports/dashboard/doctor');
    return response.data;
  },
  getPatientDashboard: async () => {
    const response = await api.get<PatientDashboardStats>('/reports/dashboard/patient');
    return response.data;
  },
  getAppointmentStats: async () => {
    const response = await api.get('/reports/appointments/stats');
    return response.data;
  },
  getMonthlyRevenue: async () => {
    const response = await api.get('/reports/revenue/monthly');
    return response.data;
  },
  getMonthlyPatients: async () => {
    const response = await api.get('/reports/patients/monthly');
    return response.data;
  },
  getDepartmentStats: async () => {
    const response = await api.get('/reports/departments/stats');
    return response.data;
  }
};
