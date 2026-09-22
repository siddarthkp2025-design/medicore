import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';

// Placeholders for pages that will be created
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const AdminDashboard = React.lazy(() => import('@/pages/dashboard/AdminDashboard'));
const DoctorDashboard = React.lazy(() => import('@/pages/dashboard/DoctorDashboard'));
const PatientDashboard = React.lazy(() => import('@/pages/dashboard/PatientDashboard'));
const PatientList = React.lazy(() => import('@/pages/patients/PatientList'));
const PatientForm = React.lazy(() => import('@/pages/patients/PatientForm'));
const PatientDetail = React.lazy(() => import('@/pages/patients/PatientDetail'));
const DoctorList = React.lazy(() => import('@/pages/doctors/DoctorList'));
const DoctorForm = React.lazy(() => import('@/pages/doctors/DoctorForm'));
const DoctorDetail = React.lazy(() => import('@/pages/doctors/DoctorDetail'));
const DepartmentList = React.lazy(() => import('@/pages/departments/DepartmentList'));
const DepartmentForm = React.lazy(() => import('@/pages/departments/DepartmentForm'));
const AppointmentList = React.lazy(() => import('@/pages/appointments/AppointmentList'));
const AppointmentForm = React.lazy(() => import('@/pages/appointments/AppointmentForm'));
const AppointmentDetail = React.lazy(() => import('@/pages/appointments/AppointmentDetail'));
const AdmissionList = React.lazy(() => import('@/pages/admissions/AdmissionList'));
const AdmissionForm = React.lazy(() => import('@/pages/admissions/AdmissionForm'));
const RoomList = React.lazy(() => import('@/pages/rooms/RoomList'));
const RoomForm = React.lazy(() => import('@/pages/rooms/RoomForm'));
const MedicalRecordList = React.lazy(() => import('@/pages/medical-records/MedicalRecordList'));
const MedicalRecordForm = React.lazy(() => import('@/pages/medical-records/MedicalRecordForm'));
const MedicineList = React.lazy(() => import('@/pages/medicines/MedicineList'));
const MedicineForm = React.lazy(() => import('@/pages/medicines/MedicineForm'));
const PrescriptionList = React.lazy(() => import('@/pages/prescriptions/PrescriptionList'));
const PrescriptionForm = React.lazy(() => import('@/pages/prescriptions/PrescriptionForm'));
const PrescriptionView = React.lazy(() => import('@/pages/prescriptions/PrescriptionView'));
const BillList = React.lazy(() => import('@/pages/billing/BillList'));
const BillForm = React.lazy(() => import('@/pages/billing/BillForm'));
const InvoiceView = React.lazy(() => import('@/pages/billing/InvoiceView'));
const ReportsPage = React.lazy(() => import('@/pages/reports/ReportsPage'));

const DashboardRouter = () => {
  const { isAdmin, isDoctor, isPatient } = useAuth();
  
  if (isAdmin) return <AdminDashboard />;
  if (isDoctor) return <DoctorDashboard />;
  if (isPatient) return <PatientDashboard />;
  return <Navigate to="/login" replace />;
};

export function AppRouter() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            
            {/* Patients */}
            <Route path="/patients" element={<PatientList />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id/edit" element={<PatientForm />} />
            </Route>
            <Route path="/patients/:id" element={<PatientDetail />} />

            {/* Doctors */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/doctors/new" element={<DoctorForm />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/doctors/:id/edit" element={<DoctorForm />} />
            </Route>

            {/* Departments */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/departments/new" element={<DepartmentForm />} />
              <Route path="/departments/:id/edit" element={<DepartmentForm />} />
            </Route>

            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/appointments/:id" element={<AppointmentDetail />} />

            {/* Admissions */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admissions" element={<AdmissionList />} />
              <Route path="/admissions/new" element={<AdmissionForm />} />
            </Route>

            {/* Rooms */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/new" element={<RoomForm />} />
              <Route path="/rooms/:id/edit" element={<RoomForm />} />
            </Route>

            {/* Medical Records */}
            <Route path="/medical-records" element={<MedicalRecordList />} />
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/medical-records/new" element={<MedicalRecordForm />} />
            </Route>

            {/* Medicines */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/medicines" element={<MedicineList />} />
              <Route path="/medicines/new" element={<MedicineForm />} />
              <Route path="/medicines/:id/edit" element={<MedicineForm />} />
            </Route>

            {/* Prescriptions */}
            <Route path="/prescriptions" element={<PrescriptionList />} />
            <Route path="/prescriptions/:id" element={<PrescriptionView />} />
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/prescriptions/new" element={<PrescriptionForm />} />
            </Route>

            {/* Billing */}
            <Route path="/billing" element={<BillList />} />
            <Route path="/billing/:id" element={<InvoiceView />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/billing/new" element={<BillForm />} />
            </Route>

            {/* Reports */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
}
