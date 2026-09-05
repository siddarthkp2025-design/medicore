import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Plus,
  FlaskConical,
  Pill,
  Calendar,
  Stethoscope,
  Printer,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { Prescription } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const { isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const res = await prescriptionService.getAll();
      setPrescriptions(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch prescriptions from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filtered = prescriptions.filter((p: any) => {
    const pName = (p.patientName || (p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '')).toLowerCase();
    const dName = (p.doctorName || (p.doctor ? `${p.doctor.firstName} ${p.doctor.lastName}` : '')).toLowerCase();
    const notes = (p.notes || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    if (!isPatient) {
      return pName.includes(term) || dName.includes(term) || notes.includes(term);
    } else {
      return dName.includes(term) || notes.includes(term);
    }
  });

  const columns = [
    {
      header: 'Prescription #',
      accessor: (p: any) => <span className="font-bold text-slate-900">Rx-{p.id || p.prescriptionId}</span>
    },
    ...(!isPatient ? [{
      header: 'Patient Name',
      accessor: (p: any) => {
        const pName = p.patientName || (p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : 'Patient');
        return <span className="font-semibold text-slate-900">{pName}</span>;
      }
    }] : []),
    {
      header: 'Prescribing Physician',
      accessor: (p: any) => {
        const dName = p.doctorName || (p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : 'Physician');
        return <span className="font-bold text-slate-900">{dName}</span>;
      }
    },
    {
      header: 'Prescription Date',
      accessor: (p: any) => <span className="text-xs text-slate-600 font-medium">{p.prescriptionDate}</span>
    },
    {
      header: 'Clinical Instructions',
      accessor: (p: any) => <span className="text-xs text-slate-600 line-clamp-1 italic">{p.notes || 'As advised'}</span>
    },
    {
      header: 'Actions',
      accessor: (p: any) => {
        const id = p.id || p.prescriptionId;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/prescriptions/${id}`)}
            className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View / Print Rx
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPatient ? 'My Active Prescriptions' : 'Clinical Prescriptions & Medication Regimens'}
        description={
          isPatient
            ? 'Access your active physician prescriptions, medication dosages, administration frequency, and printable Rx sheets.'
            : 'Outpatient medical prescriptions, pharmaceutical items, and physician orders.'
        }
        action={
          isDoctor && (
            <Button onClick={() => navigate('/prescriptions/new')} className="bg-primary-700 hover:bg-primary-800 text-xs font-bold shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Write New Prescription
            </Button>
          )
        }
      />

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder={isPatient ? 'Search doctor or medication advice...' : 'Search by patient, doctor, or notes...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs border-slate-200 bg-slate-50 focus-visible:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Rx Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Rx Cards vs Table */}
      {viewMode === 'cards' ? (
        filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
            <FlaskConical className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">No Prescriptions Found</h3>
            <p className="text-xs text-slate-500 mt-1">No medication orders match your current search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p: any) => {
              const id = p.id || p.prescriptionId;
              const pName = p.patientName || (p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : 'Patient');
              const dName = p.doctorName || (p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : 'Physician');

              return (
                <Card
                  key={id}
                  className="bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all rounded-xl p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs">
                          Rx
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block">Order #{id}</span>
                          <span className="text-3xs text-slate-400 font-medium">{p.prescriptionDate}</span>
                        </div>
                      </div>
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Verified Rx
                      </span>
                    </div>

                    <div>
                      <span className="text-3xs font-semibold text-slate-400 uppercase block">Prescribed By</span>
                      <p className="text-xs font-bold text-slate-900">{dName}</p>
                    </div>

                    {!isPatient && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                        <span className="text-3xs font-semibold text-slate-400 uppercase block">Patient</span>
                        <p className="font-bold text-slate-900">{pName}</p>
                      </div>
                    )}

                    <div className="text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Doctor's Instructions
                      </span>
                      <p className="text-slate-700 italic line-clamp-2">
                        "{p.notes || 'Take medications strictly as per instructed dosage.'}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/prescriptions/${id}`)}
                      className="w-full text-xs font-bold text-primary-700 hover:bg-primary-50 border-slate-200 h-8"
                    >
                      <Printer className="h-3.5 w-3.5 mr-1.5" /> View & Print Prescription
                    </Button>
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
          searchPlaceholder="Search prescriptions..."
        />
      )}
    </div>
  );
}
