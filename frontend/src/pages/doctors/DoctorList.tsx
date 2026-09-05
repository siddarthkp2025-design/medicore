import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Stethoscope, Mail, Phone } from 'lucide-react';
import { doctorService } from '@/services/doctor.service';
import { Doctor } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await doctorService.getAll();
      setDoctors(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch doctors from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await doctorService.delete(deleteId);
      toast({ title: 'Success', description: 'Doctor removed successfully.' });
      setDeleteId(null);
      fetchDoctors();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete doctor.' });
    }
  };

  const filtered = doctors.filter((doc: any) => {
    const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const spec = (doc.specialization || '').toLowerCase();
    const dept = (doc.departmentName || doc.department?.name || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || spec.includes(term) || dept.includes(term);
  });

  const columns = [
    {
      header: 'Doctor ID',
      accessor: (d: any) => <span className="font-semibold text-slate-900">DOC-{d.id || d.doctorId}</span>
    },
    {
      header: 'Physician Name',
      accessor: (d: any) => (
        <div>
          <span className="font-bold text-slate-900 block">Dr. {d.firstName} {d.lastName}</span>
          <span className="text-2xs text-slate-500 font-medium">{d.qualification || 'MD'} • {d.experienceYears || 0} yrs exp</span>
        </div>
      )
    },
    {
      header: 'Specialization',
      accessor: (d: any) => (
        <span className="font-semibold text-xs text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-200/60">
          {d.specialization}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: (d: any) => (
        <span className="text-xs text-slate-700 font-medium">
          {d.departmentName || d.department?.name || 'General Care'}
        </span>
      )
    },
    {
      header: 'Contact',
      accessor: (d: any) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block">{d.phone}</span>
          <span className="text-2xs text-slate-500">{d.email}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (d: any) => <StatusBadge status={d.status || 'Active'} />
    },
    {
      header: 'Actions',
      accessor: (d: any) => {
        const id = d.id || d.doctorId;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/doctors/${id}`)}
              className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> Profile
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/doctors/${id}/edit`)}
                  className="text-2xs h-7 px-2 text-slate-700 hover:bg-slate-50 border-slate-200"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(id)}
                  className="text-2xs h-7 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Physician & Doctor Directory"
        description="Clinical faculty, specialists, departmental assignments, and qualifications."
        action={
          isAdmin && (
            <Button onClick={() => navigate('/doctors/new')} className="bg-primary-700 hover:bg-primary-800">
              <Plus className="mr-2 h-4 w-4" /> Register New Doctor
            </Button>
          )
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search doctors by name, specialization, or department..."
        onSearch={setSearchTerm}
        emptyMessage="No doctors found matching criteria."
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Doctor Profile"
        description="Are you sure you want to remove this doctor from the active staff directory?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
