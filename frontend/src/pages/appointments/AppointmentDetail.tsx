import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointment.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, User, Stethoscope, Clock, FileText, CheckCircle2, Pill, Activity, Ban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDoctor, isAdmin } = useAuth();
  const [appointment, setAppointment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAppointment = async () => {
    try {
      if (id) {
        const data = await appointmentService.getById(Number(id));
        setAppointment(data);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load appointment details from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      await appointmentService.updateStatus(Number(id), status);
      toast({ title: 'Status Updated', description: `Consultation marked as ${status}.` });
      setAppointment((prev: any) => prev ? { ...prev, status } : null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update consultation status.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !appointment) return <LoadingSkeleton rows={6} />;

  const apptId = appointment.id || appointment.appointmentId;
  const patId = appointment.patient?.id || appointment.patientId;
  const patName = appointment.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
    : (appointment.patientName || 'Patient');
  const docId = appointment.doctor?.id || appointment.doctorId;
  const docName = appointment.doctor
    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
    : (appointment.doctorName || 'Doctor');
  const deptName = appointment.department?.name || appointment.departmentName || 'General Clinic';
  
  const currentStatus = (appointment.status || '').toUpperCase();
  const isScheduled = currentStatus === 'SCHEDULED' || currentStatus === 'PENDING';
  const isConfirmed = currentStatus === 'CONFIRMED';
  const isCompleted = currentStatus === 'COMPLETED';
  const isCancelled = currentStatus === 'CANCELLED' || currentStatus === 'CANCELED';
  const isNoShow = currentStatus === 'NO_SHOW' || currentStatus === 'NO SHOW';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader 
        title={`Consultation #${apptId}`} 
        description="Patient clinical encounter details and consultation workflow."
        action={<Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>Back to List</Button>}
      />

      <Card className="border border-slate-200 shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Encounter Details</CardTitle>
            <p className="text-2xs text-slate-500 mt-0.5">Reference ID: APP-{apptId}</p>
          </div>
          <StatusBadge status={appointment.status} />
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</p>
                <p 
                  className="font-bold text-slate-900 cursor-pointer hover:text-primary-600 hover:underline"
                  onClick={() => patId && navigate(`/patients/${patId}`)}
                >
                  {patName} {patId ? `(ID: ${patId})` : ''}
                </p>
                {appointment.patient?.phone && (
                  <p className="text-xs text-slate-500">Phone: {appointment.patient.phone}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Stethoscope className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attending Specialist</p>
                <p 
                  className="font-bold text-slate-900 cursor-pointer hover:text-primary-600 hover:underline"
                  onClick={() => docId && navigate(`/doctors/${docId}`)}
                >
                  {docName}
                </p>
                <p className="text-xs text-slate-500">{deptName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Date</p>
                <p className="font-bold text-slate-900">{appointment.appointmentDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Slot</p>
                <p className="font-bold text-slate-900">{appointment.appointmentTime}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chief Medical Complaint / Reason</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{appointment.reason || 'Routine consultation'}</p>
                {appointment.notes && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold">Physician Notes:</span> {appointment.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Consultation Workflow Actions */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            
            {/* If completed, show verification badge */}
            {isCompleted && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                This consultation has been marked as Completed and closed.
              </div>
            )}

            {/* Quick Actions for Attending Doctor / Admin */}
            {(isDoctor || isAdmin) && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Clinical Attending Actions</p>
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-primary-300 text-primary-700 hover:bg-primary-50 bg-white"
                    onClick={() => navigate(`/medical-records/new`)}
                  >
                    <Activity className="h-3.5 w-3.5 mr-1.5 text-primary-600" /> Document Encounter (EMR)
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-primary-300 text-primary-700 hover:bg-primary-50 bg-white"
                    onClick={() => navigate(`/prescriptions/new`)}
                  >
                    <Pill className="h-3.5 w-3.5 mr-1.5 text-primary-600" /> Prescribe Medicines
                  </Button>
                </div>
              </div>
            )}

            {/* Status Control Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              {(isScheduled || isConfirmed) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    className="text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
                    onClick={() => updateStatus('No Show')}
                  >
                    Mark No Show
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => updateStatus('Cancelled')}
                  >
                    <Ban className="h-3 w-3 mr-1" /> Cancel
                  </Button>

                  {isScheduled && (
                    <Button
                      size="sm"
                      disabled={isUpdating}
                      className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold"
                      onClick={() => updateStatus('Confirmed')}
                    >
                      Confirm
                    </Button>
                  )}

                  {/* Primary close action: Mark Consultation as Completed */}
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                    onClick={() => updateStatus('Completed')}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Close & Mark Completed
                  </Button>
                </>
              )}

              {isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/appointments')}
                  className="text-xs"
                >
                  Return to Appointments Queue
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
