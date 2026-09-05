import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Building2, Phone, MapPin } from 'lucide-react';
import { departmentService } from '@/services/department.service';
import { Department } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/hooks/useAuth';

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await departmentService.getAll();
      setDepartments(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch departments from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await departmentService.delete(deleteId);
      toast({ title: 'Success', description: 'Department deleted successfully.' });
      setDeleteId(null);
      fetchDepartments();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete department.' });
    }
  };

  const filtered = departments.filter((d: any) => {
    const name = (d.name || '').toLowerCase();
    const desc = (d.description || '').toLowerCase();
    const loc = (d.location || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || desc.includes(term) || loc.includes(term);
  });

  const columns = [
    {
      header: 'Dept ID',
      accessor: (d: any) => <span className="font-semibold text-slate-900">DEP-{d.id || d.departmentId}</span>
    },
    {
      header: 'Department Name',
      accessor: (d: any) => (
        <div>
          <span className="font-bold text-slate-900 block">{d.name}</span>
          <span className="text-2xs text-slate-500">{d.description}</span>
        </div>
      )
    },
    {
      header: 'Campus Location',
      accessor: (d: any) => (
        <span className="text-xs text-slate-700 flex items-center gap-1">
          <MapPin className="h-3 w-3 text-slate-400" /> {d.location || 'Main Medical Center'}
        </span>
      )
    },
    {
      header: 'Contact Extension',
      accessor: (d: any) => (
        <span className="text-xs text-slate-700 flex items-center gap-1">
          <Phone className="h-3 w-3 text-slate-400" /> {d.phone || '011-2345-0100'}
        </span>
      )
    },
    {
      header: 'Operational Status',
      accessor: (d: any) => (
        <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${d.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
          {d.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    ...(isAdmin ? [{
      header: 'Actions',
      accessor: (d: any) => {
        const id = d.id || d.departmentId;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/departments/${id}/edit`)}
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
          </div>
        );
      }
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Departments & Centers of Excellence"
        description="Specialized medical departments, outpatient wards, and clinical specialties."
        action={
          isAdmin && (
            <Button onClick={() => navigate('/departments/new')} className="bg-primary-700 hover:bg-primary-800">
              <Plus className="mr-2 h-4 w-4" /> Add Department
            </Button>
          )
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search departments by name or location..."
        onSearch={setSearchTerm}
        emptyMessage="No departments found."
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Department"
        description="Are you sure you want to delete this department? This operation may fail if doctors are currently assigned."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
