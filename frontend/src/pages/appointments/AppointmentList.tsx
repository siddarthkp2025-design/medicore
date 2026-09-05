import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Plus,
  Calendar,
  Clock,
  Stethoscope,
  Ban,
  LayoutGrid,
  List,
  MapPin,
  Building2,
  Search,
  Filter
} from 'lucide-react';
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [cancelId, setCancelId] = useState<number | null>(null);

  const { isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await appointmentService.getAll();
      setAppointments(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch appointments from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async () => {
    if (!cancelId) return;
    try {
      await appointmentService.updateStatus(cancelId, 'Cancelled');
      toast({ title: 'Appointment Cancelled', description: 'Your consultation has been marked as cancelled.' });
      setCancelId(null);
      fetchAppointments();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to cancel appointment.' });
    }
  };

  const filtered = appointments.filter((apt: any) => {
    if (statusFilter !== 'ALL' && apt.status?.toUpperCase() !== statusFilter) {
      return false;
    }
    if (!isPatient && searchTerm) {
      const pName = apt.patientName || (apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : '');
      const dName = apt.doctorName || (apt.doctor ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : '');
      const term = searchTerm.toLowerCase();
      if (!pName.toLowerCase().includes(term) && !dName.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const scheduledCount = appointments.filter(a => ['SCHEDULED', 'CONFIRMED'].includes(a.status?.toUpperCase())).length;
  const completedCount = appointments.filter(a => a.status?.toUpperCase() === 'COMPLETED').length;

  const columns = [
    {
      header: 'Appt #',
      accessor: (a: any) => <span className="font-bold text-slate-900">APP-{a.id || a.appointmentId}</span>
    },
    ...(!isPatient ? [{
      header: 'Patient',
      accessor: (a: any) => {
        const pName = a.patientName || (a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Patient');
        return <span className="font-semibold text-slate-900">{pName}</span>;
      }
    }] : []),
    {
      header: 'Consultant Physician',
      accessor: (a: any) => {
        const dName = a.doctorName || (a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : 'Physician');
        const dept = a.departmentName || a.doctor?.department?.name || 'General OPD';
        return (
          <div>
            <span className="font-bold text-slate-900 block">{dName}</span>
            <span className="text-2xs text-slate-500 font-medium">{dept}</span>
          </div>
        );
      }
    },
    {
      header: 'Date & Time',
      accessor: (a: any) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <Calendar className="h-3.5 w-3.5 text-primary-600" />
          <span>{a.appointmentDate}</span>
          <span className="text-slate-400">•</span>
          <span className="font-bold text-slate-900">{a.appointmentTime}</span>
        </div>
      )
    },
    {
      header: 'Reason',
      accessor: (a: any) => <span className="text-xs text-slate-600 line-clamp-1 italic">"{a.reason || 'General Health Consultation'}"</span>
    },
    {
      header: 'Status',
      accessor: (a: any) => <StatusBadge status={a.status} />
    },
    {
      header: 'Actions',
      accessor: (a: any) => {
        const id = a.id || a.appointmentId;
        const isCancellable = ['Scheduled', 'Confirmed'].includes(a.status);
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/appointments/${id}`)}
              className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> View
            </Button>
            {isCancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelId(id)}
                className="text-2xs h-7 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                <Ban className="h-3 w-3 mr-1" /> Cancel
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPatient ? 'My Outpatient Consultations' : 'Appointment Scheduling & Queue'}
        description={
          isPatient
            ? 'Track your clinical appointments, attending doctors, scheduled times, and clinic locations.'
            : 'Hospital-wide consultation bookings, physician allocations, and real-time scheduling queue.'
        }
        action={
          <Button onClick={() => navigate('/appointments/new')} className="bg-primary-700 hover:bg-primary-800 text-xs font-bold shadow-sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Book Consultation
          </Button>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Consultations</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{appointments.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming / Scheduled</p>
          <p className="text-2xl font-black text-teal-600 mt-1">{scheduledCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Visits</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Controls: Filter Pills, Search & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-2xs font-bold tracking-wider uppercase transition-all ${
                statusFilter === st
                  ? 'bg-primary-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Visits' : st}
            </button>
          ))}
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-3">
          {!isPatient && (
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs border-slate-200 bg-slate-50 focus-visible:bg-white"
              />
            </div>
          )}

          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs transition-all ${
                viewMode === 'cards' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-all ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Rich Cards vs Table */}
      {viewMode === 'cards' ? (
        filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">No Consultations Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different status filter or clear your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((apt: any) => {
              const pName = apt.patientName || (apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Patient');
              const dName = apt.doctorName || (apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Physician');
              const dept = apt.departmentName || apt.doctor?.department?.name || 'Clinical Care';
              const isCancellable = ['Scheduled', 'Confirmed'].includes(apt.status);
              const id = apt.id || apt.appointmentId;

              return (
                <Card
                  key={id}
                  className="bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all rounded-xl p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                        APP-{id}
                      </span>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary-700 shrink-0" />
                        <h4 className="font-extrabold text-sm text-slate-900">{dName}</h4>
                      </div>
                      <p className="text-2xs font-semibold text-primary-700 ml-6">{dept}</p>
                    </div>

                    {!isPatient && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                        <span className="text-3xs font-semibold text-slate-400 block uppercase">Patient</span>
                        <span className="font-bold text-slate-900">{pName}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 italic font-medium">
                      "{apt.reason || 'General Consultation'}"
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-2xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-primary-600" />
                        <span>{apt.appointmentDate} at {apt.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3 w-3 text-slate-400" /> Main Medical Center, OPD Wing
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/appointments/${id}`)}
                      className="text-xs font-semibold h-8 flex-1 border-slate-200 hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                    </Button>
                    {isCancellable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelId(id)}
                        className="text-xs font-semibold h-8 text-rose-600 hover:bg-rose-50 border-rose-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Search consultations..."
        />
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Outpatient Appointment"
        description="Are you sure you want to cancel this consultation booking? The doctor will be notified."
        onConfirm={handleCancelAppointment}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
