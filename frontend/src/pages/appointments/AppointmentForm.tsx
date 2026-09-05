import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { appointmentService } from '@/services/appointment.service';
import { doctorService } from '@/services/doctor.service';
import { departmentService } from '@/services/department.service';
import { patientService } from '@/services/patient.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Doctor, Department, Patient } from '@/types';
import { Calendar, Clock, Stethoscope, User, Building, AlertCircle } from 'lucide-react';

const numericRequiredId = (message: string) =>
  z.preprocess((val) => {
    if (val === '' || val === undefined || val === null || (typeof val === 'number' && Number.isNaN(val))) {
      return undefined;
    }
    const num = typeof val === 'string' ? Number(val) : val;
    return Number.isNaN(num) ? undefined : num;
  }, z.number({
    required_error: message,
    invalid_type_error: message,
  }).min(1, message));

const numericOptionalId = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null || (typeof val === 'number' && Number.isNaN(val))) {
    return undefined;
  }
  const num = typeof val === 'string' ? Number(val) : val;
  return Number.isNaN(num) ? undefined : num;
}, z.number().optional());

const schema = z.object({
  patientId: numericOptionalId,
  departmentId: numericRequiredId('Please select a clinical department'),
  doctorId: numericRequiredId('Please select an attending physician'),
  appointmentDate: z.string().min(1, 'Consultation date is required'),
  appointmentTime: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(3, 'Reason for consultation must be at least 3 characters'),
});

type FormData = z.infer<typeof schema>;

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPatient, isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | ''>(1);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: undefined,
      departmentId: 1,
      doctorId: 2001,
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      reason: '',
    }
  });

  const currentDeptId = watch('departmentId');
  const currentDocId = watch('doctorId');
  const currentPatId = watch('patientId');

  useEffect(() => {
    register('departmentId');
    register('doctorId');
    register('patientId');
  }, [register]);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll()
        ]);
        const deptList = deptRes?.content || [];
        const docList = docRes?.content || [];
        setDepartments(deptList);
        setDoctors(docList);

        if (deptList.length > 0) {
          const firstDeptId = Number(deptList[0].departmentId);
          setSelectedDeptId(firstDeptId);
          setValue('departmentId', firstDeptId, { shouldValidate: true });

          const docsInDept = docList.filter(d => Number(d.departmentId) === firstDeptId);
          if (docsInDept.length > 0) {
            setValue('doctorId', Number(docsInDept[0].doctorId), { shouldValidate: true });
          } else {
            setValue('doctorId', 0, { shouldValidate: true });
          }
        }

        if (isAdmin) {
          const patRes = await patientService.getAll();
          setPatients(patRes?.content || []);
        }
      } catch (err) {
        console.error('Failed to load clinic master data', err);
      }
    };
    loadMasterData();
  }, [isAdmin, setValue]);

  // Filter doctors by selected department
  const activeDept = currentDeptId ? Number(currentDeptId) : (selectedDeptId ? Number(selectedDeptId) : undefined);
  const filteredDoctors = doctors.filter(doc => 
    !activeDept || Number(doc.departmentId) === activeDept
  );

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const deptId = val ? Number(val) : 0;
    setSelectedDeptId(deptId ? deptId : '');
    setValue('departmentId', deptId, { shouldValidate: true });

    // Auto-select first doctor in department if available, else clear
    const docsInDept = doctors.filter(d => Number(d.departmentId) === deptId);
    if (docsInDept.length > 0) {
      setValue('doctorId', Number(docsInDept[0].doctorId), { shouldValidate: true });
    } else {
      setValue('doctorId', 0, { shouldValidate: true });
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const docId = val ? Number(val) : 0;
    setValue('doctorId', docId, { shouldValidate: true });
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const patId = val ? Number(val) : undefined;
    setValue('patientId', patId, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await appointmentService.create(data as any);
      toast({
        title: 'Appointment Confirmed',
        description: 'Your clinical consultation appointment has been scheduled successfully.'
      });
      navigate('/appointments');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Doctor is not available at this time or scheduling conflict.';
      toast({
        variant: 'destructive',
        title: 'Scheduling Conflict',
        description: msg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={isPatient ? "Book a Consultation" : "Schedule Patient Appointment"}
        description={
          isPatient
            ? "Choose your clinical department, attending physician, and preferred consultation schedule."
            : "Register an outpatient consultation encounter into the clinic schedule."
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-slate-200/90 shadow-2xs rounded-xl overflow-hidden">
          <CardContent className="p-6 space-y-6">

            {/* Admin Patient Selector */}
            {isAdmin && (
              <div className="space-y-1.5">
                <Label htmlFor="patientId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary-600" /> Patient Name *
                </Label>
                <select
                  id="patientId"
                  value={currentPatId ?? ''}
                  onChange={handlePatientChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">-- Select Registered Patient --</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.firstName} {p.lastName} (ID: {p.patientId} • {p.phone})
                    </option>
                  ))}
                </select>
                {errors.patientId && <p className="text-2xs text-rose-600 font-semibold">{errors.patientId.message}</p>}
              </div>
            )}

            {/* Clinical Department */}
            <div className="space-y-1.5">
              <Label htmlFor="departmentId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-primary-600" /> Clinical Department *
              </Label>
              <select
                id="departmentId"
                value={currentDeptId ? currentDeptId : (selectedDeptId || '')}
                onChange={handleDeptChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">-- Select Specialty --</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name} {dept.location ? `(${dept.location})` : ''}
                  </option>
                ))}
              </select>
              {errors.departmentId && <p className="text-2xs text-rose-600 font-semibold">{errors.departmentId.message}</p>}
            </div>

            {/* Attending Physician */}
            <div className="space-y-1.5">
              <Label htmlFor="doctorId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-primary-600" /> Attending Specialist / Doctor *
              </Label>
              <select
                id="doctorId"
                value={currentDocId ?? ''}
                onChange={handleDoctorChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">-- Select Doctor --</option>
                {filteredDoctors.map(doc => (
                  <option key={doc.doctorId} value={doc.doctorId}>
                    Dr. {doc.firstName} {doc.lastName} • {doc.specialization} ({doc.qualification || 'MD'})
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="text-2xs text-rose-600 font-semibold">{errors.doctorId.message}</p>}
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="appointmentDate" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary-600" /> Preferred Date *
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={todayStr}
                  {...register('appointmentDate')}
                  className="h-10 text-xs font-semibold border-slate-200"
                />
                {errors.appointmentDate && <p className="text-2xs text-rose-600 font-semibold">{errors.appointmentDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="appointmentTime" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary-600" /> Consultation Time Slot *
                </Label>
                <select
                  id="appointmentTime"
                  {...register('appointmentTime')}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.appointmentTime && <p className="text-2xs text-rose-600 font-semibold">{errors.appointmentTime.message}</p>}
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-primary-600" /> Chief Medical Complaint / Reason for Visit *
              </Label>
              <Textarea
                id="reason"
                placeholder="Briefly describe your symptoms or reason for scheduling this consultation..."
                {...register('reason')}
                rows={3}
                className="text-xs border-slate-200 placeholder:text-slate-400"
              />
              {errors.reason && <p className="text-2xs text-rose-600 font-semibold">{errors.reason.message}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/appointments')}
                className="text-xs border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-bold bg-primary-700 hover:bg-primary-800 text-white shadow-sm"
              >
                {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
