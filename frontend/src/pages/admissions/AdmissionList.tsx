import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, LogOut } from 'lucide-react';
import { admissionService } from '@/services/admission.service';
import { Admission } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterPanel } from '@/components/common/FilterPanel';
import { useAuth } from '@/hooks/useAuth';

export default function AdmissionList() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dischargeId, setDischargeId] = useState<number | null>(null);

  const { isAdmin, isPatient } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAdmissions = async () => {
    setIsLoading(true);
    try {
      const res = await admissionService.getAll();
      setAdmissions(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch admissions from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleDischarge = async () => {
    if (!dischargeId) return;
    try {
      await admissionService.discharge(dischargeId);
      toast({ title: 'Success', description: 'Patient discharged successfully and room released.' });
      setDischargeId(null);
      fetchAdmissions();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to discharge patient.' });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filtered = admissions.filter((a: any) => {
    if (filters.status && filters.status !== 'ALL') {
      if (a.status?.toUpperCase() !== filters.status.toUpperCase()) return false;
    }
    if (!isPatient && searchTerm) {
      const pName = a.patientName || (a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '');
      if (!pName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Adm #',
      accessor: (a: any) => <span className="font-semibold text-slate-900">#{a.id || a.admissionId}</span>
    },
    ...(!isPatient ? [{
      header: 'Patient Name',
      accessor: (a: any) => {
        const pName = a.patientName || (a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Patient');
        return <span className="font-semibold text-slate-900">{pName}</span>;
      }
    }] : []),
    {
      header: 'Room',
      accessor: (a: any) => {
        const roomNum = a.roomNumber || a.room?.roomNumber || 'Room';
        const rType = a.room?.roomType || '';
        return (
          <div>
            <span className="font-bold text-slate-900 block">{roomNum}</span>
            <span className="text-2xs text-slate-500">{rType}</span>
          </div>
        );
      }
    },
    {
      header: 'Attending Doctor',
      accessor: (a: any) => {
        const dName = a.doctorName || (a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : 'Doctor');
        return <span className="font-medium text-slate-700">{dName}</span>;
      }
    },
    {
      header: 'Admission Date',
      accessor: (a: any) => <span className="text-xs text-slate-600 font-medium">{a.admissionDate}</span>
    },
    {
      header: 'Diagnosis',
      accessor: (a: any) => <span className="text-xs text-slate-600 line-clamp-1">{a.diagnosis || 'Inpatient Care'}</span>
    },
    {
      header: 'Status',
      accessor: (a: any) => <StatusBadge status={a.status} />
    },
    ...(!isPatient ? [{
      header: 'Actions',
      accessor: (a: any) => {
        const id = a.id || a.admissionId;
        const isAdmitted = a.status?.toUpperCase() === 'ADMITTED';
        return (
          <div className="flex items-center gap-1.5">
            {isAdmitted && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDischargeId(id)}
                className="text-2xs h-7 px-2 text-amber-700 hover:bg-amber-50 border-amber-200"
              >
                <LogOut className="h-3 w-3 mr-1" /> Discharge
              </Button>
            )}
          </div>
        );
      }
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPatient ? 'My Inpatient Stays' : 'Inpatient Admissions & Discharges'}
        description={
          isPatient
            ? 'Records of your inpatient ward admissions and hospital stays.'
            : 'Inpatient bed tracking, active hospital admissions, and discharge workflow directly from the hospital database.'
        }
        action={
          isAdmin && (
            <Button onClick={() => navigate('/admissions/new')} className="bg-primary-700 hover:bg-primary-800">
              <Plus className="mr-2 h-4 w-4" /> New Inpatient Admission
            </Button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <FilterPanel
          filters={[{
            key: 'status',
            placeholder: 'Filter by Status',
            options: [
              { label: 'All Admissions', value: 'ALL' },
              { label: 'Admitted', value: 'Admitted' },
              { label: 'Discharged', value: 'Discharged' },
            ]
          }]}
          onFilterChange={handleFilterChange}
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder={isPatient ? '' : 'Search admissions by patient...'}
        onSearch={isPatient ? undefined : setSearchTerm}
        emptyMessage={isPatient ? 'No inpatient admission records.' : 'No admission records found.'}
      />

      <ConfirmDialog
        open={!!dischargeId}
        title="Confirm Discharge"
        description="Are you sure you want to discharge this patient? The room status will automatically update to Available."
        onConfirm={handleDischarge}
        onCancel={() => setDischargeId(null)}
      />
    </div>
  );
}
