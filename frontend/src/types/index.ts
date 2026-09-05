export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export interface Patient {
  patientId: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  registrationDate: string;
}

export interface Doctor {
  doctorId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  departmentId: number;
  departmentName: string;
  qualification: string;
  experienceYears: number;
  joiningDate: string;
  status: string;
}

export interface Department {
  departmentId: number;
  name: string;
  description: string;
  location: string;
  phone: string;
  isActive: boolean;
  doctorCount: number;
}

export interface Appointment {
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export interface Room {
  roomId: number;
  roomNumber: string;
  roomType: string;
  floorNumber: string;
  dailyCharge: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Admission {
  admissionId: number;
  patientId: number;
  patientName: string;
  roomId: number;
  roomNumber: string;
  doctorId: number;
  doctorName: string;
  admissionDate: string;
  expectedDischargeDate: string;
  actualDischargeDate?: string;
  diagnosis: string;
  status: 'ADMITTED' | 'DISCHARGED';
}

export interface MedicalRecord {
  recordId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface Medicine {
  medicineId: number;
  name: string;
  category: string;
  manufacturer: string;
  unitPrice: number;
  stockQuantity: number;
  expiryDate: string;
  reorderLevel: number;
}

export interface PrescriptionItem {
  itemId?: number;
  medicineId: number;
  medicineName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  prescriptionId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  recordId?: number;
  prescriptionDate: string;
  notes: string;
  items: PrescriptionItem[];
}

export interface BillItem {
  billItemId?: number;
  description: string;
  category: string;
  amount: number;
  quantity: number;
}

export interface Bill {
  id?: number;
  billId: number;
  patientId: number;
  patientName: string;
  patient?: any;
  appointmentId?: number;
  admissionId?: number;
  consultationCharge: number;
  roomCharge: number;
  medicineCharge: number;
  otherCharges: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | string;
  paymentMethod?: string;
  billingDate: string;
  paymentDate?: string;
  items: BillItem[];
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  userId: number;
  username: string;
  fullName: string;
  email?: string;
}

export interface AdminDashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  availableRooms: number;
  pendingBills: number;
  monthlyRevenue: number;
  appointmentTrends: { name: string; total: number }[];
  revenueTrends: { name: string; total: number }[];
  departmentStats: { name: string; value: number }[];
  recentAppointments: Appointment[];
  recentPatients: Patient[];
}

export interface DoctorDashboardStats {
  todayAppointments: number;
  upcomingAppointments: number;
  totalPatients: number;
  pendingConsultations: number;
  recentMedicalRecords: MedicalRecord[];
  recentPrescriptions: Prescription[];
}

export interface PatientDashboardStats {
  upcomingAppointment: Appointment | null;
  appointmentHistory: Appointment[];
  recentMedicalRecord: MedicalRecord | null;
  activePrescriptions: Prescription[];
  outstandingBills: Bill[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  details: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  username: string;
  password: string;
}

