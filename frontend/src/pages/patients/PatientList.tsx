import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, User, Phone, MapPin } from 'lucide-react';
import { patientService } from '@/services/patient.service';
import { Patient } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isAdmin, isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await patientService.getAll();
      setPatients(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch patients from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await patientService.delete(deleteId);
      toast({ title: 'Success', description: 'Patient record removed successfully.' });
      setDeleteId(null);
      fetchPatients();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete patient.' });
    }
  };

  const filtered = patients.filter((p: any) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const phone = p.phone || '';
    const email = p.email || '';
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || phone.includes(term) || email.includes(term);
  });

  const columns = [
    {
      header: 'Patient ID',
      accessor: (p: any) => <span className="font-semibold text-slate-900">MED-{p.id || p.patientId}</span>
    },
    {
      header: 'Full Name',
      accessor: (p: any) => (
        <div>
          <span className="font-bold text-slate-900 block">{p.firstName} {p.lastName}</span>
          <span className="text-2xs text-slate-500">{p.gender} • DOB: {p.dateOfBirth}</span>
        </div>
      )
    },
    {
      header: 'Blood Group',
      accessor: (p: any) => (
        <span className="font-bold text-xs text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-200/60">
          {p.bloodGroup || 'N/A'}
        </span>
      )
    },
    {
      header: 'Contact Info',
      accessor: (p: any) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block">{p.phone}</span>
          <span className="text-2xs text-slate-500">{p.email || '-'}</span>
        </div>
      )
    },
    {
      header: 'Registered',
      accessor: (p: any) => <span className="text-xs text-slate-600">{p.registrationDate || 'Standard'}</span>
    },
    {
      header: 'Actions',
      accessor: (p: any) => {
        const id = p.id || p.patientId;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/patients/${id}`)}
              className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> Profile
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/patients/${id}/edit`)}
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
        title={isPatient ? 'My Profile Record' : 'Patient Directory & Electronic Health Index'}
        description={
          isPatient
            ? 'Your registered healthcare demographic profile.'
            : 'Central patient master index, demographics, and clinical case history.'
        }
        action={
          isAdmin && (
            <Button onClick={() => navigate('/patients/new')} className="bg-primary-700 hover:bg-primary-800">
              <Plus className="mr-2 h-4 w-4" /> Register New Patient
            </Button>
          )
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder={isPatient ? '' : 'Search patients by name, phone, or email...'}
        onSearch={isPatient ? undefined : setSearchTerm}
        emptyMessage="No patient records found."
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Patient Record"
        description="Are you sure you want to delete this patient record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
