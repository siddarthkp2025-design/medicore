import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Pill, AlertTriangle } from 'lucide-react';
import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function MedicineList() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const res = await medicineService.getAll();
      setMedicines(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch medicines from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await medicineService.delete(deleteId);
      toast({ title: 'Success', description: 'Medicine removed from formulary.' });
      setDeleteId(null);
      fetchMedicines();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete medicine.' });
    }
  };

  const filtered = medicines.filter((m: any) => {
    const name = (m.name || '').toLowerCase();
    const cat = (m.category || '').toLowerCase();
    const mfg = (m.manufacturer || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || cat.includes(term) || mfg.includes(term);
  });

  const columns = [
    {
      header: 'Code',
      accessor: (m: any) => <span className="font-semibold text-slate-900">MED-{m.id || m.medicineId}</span>
    },
    {
      header: 'Medicine Name',
      accessor: (m: any) => (
        <div>
          <span className="font-bold text-slate-900 block">{m.name}</span>
          <span className="text-2xs text-slate-500">{m.manufacturer}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (m: any) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {m.category || 'General'}
        </span>
      )
    },
    {
      header: 'Unit Price',
      accessor: (m: any) => <span className="font-bold text-slate-900 text-xs">₹{Number(m.unitPrice).toFixed(2)}</span>
    },
    {
      header: 'Stock Inventory',
      accessor: (m: any) => {
        const isLow = Number(m.stockQuantity) <= Number(m.reorderLevel);
        return (
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-xs ${isLow ? 'text-amber-700' : 'text-slate-800'}`}>
              {m.stockQuantity} units
            </span>
            {isLow && (
              <span className="text-2xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-200">
                <AlertTriangle className="h-2.5 w-2.5" /> Low
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Expiry Date',
      accessor: (m: any) => <span className="text-xs text-slate-600 font-medium">{m.expiryDate}</span>
    },
    ...(isAdmin ? [{
      header: 'Actions',
      accessor: (m: any) => {
        const id = m.id || m.medicineId;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/medicines/${id}/edit`)}
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
        title="Pharmacy Formulary & Inventory"
        description="Comprehensive pharmaceutical catalog, real-time stock levels, and expiry alerts."
        action={
          isAdmin && (
            <Button onClick={() => navigate('/medicines/new')} className="bg-primary-700 hover:bg-primary-800">
              <Plus className="mr-2 h-4 w-4" /> Add Medicine
            </Button>
          )
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search medicines by name, category, or manufacturer..."
        onSearch={setSearchTerm}
        emptyMessage="No medicines found in formulary."
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Medicine"
        description="Are you sure you want to delete this pharmaceutical item from the inventory formulary?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
