import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, User, Stethoscope, Clock, FileText } from 'lucide-react';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointment = async () => {
    try {
      if (id) {
        const data = await appointmentService.getById(Number(id));
        setAppointment(data);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load appointment from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await appointmentService.updateStatus(Number(id), status);
      toast({ title: 'Success', description: `Appointment marked as ${status}.` });
      setAppointment(prev => prev ? { ...prev, status: status as any } : null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    }
  };

  if (isLoading || !appointment) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader 
        title={`Appointment #${appointment.appointmentId}`} 
        action={<Button variant="outline" onClick={() => navigate('/appointments')}>Back to List</Button>}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>Appointment Details</CardTitle>
          <StatusBadge status={appointment.status} />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient</p>
                <p className="font-semibold cursor-pointer text-primary hover:underline" onClick={() => navigate(`/patients/${appointment.patientId}`)}>{appointment.patientName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                <p className="font-semibold cursor-pointer text-primary hover:underline" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>{appointment.doctorName}</p>
                <p className="text-xs text-muted-foreground">{appointment.departmentName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="font-semibold">{appointment.appointmentDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="font-semibold">{appointment.appointmentTime}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason for Visit</p>
                <p className="mt-1">{appointment.reason}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-3 justify-end">
            {['SCHEDULED', 'PENDING'].includes(appointment.status) && (
              <>
                <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => updateStatus('NO_SHOW')}>Mark No Show</Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus('CANCELLED')}>Cancel Appointment</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => updateStatus('CONFIRMED')}>Confirm</Button>
              </>
            )}
            {appointment.status === 'CONFIRMED' && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateStatus('COMPLETED')}>Mark Completed</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
