import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Plus,
  FileText,
  Stethoscope,
  Calendar,
  Activity,
  LayoutGrid,
  List,
  Search,
  Pill,
  ClipboardCheck,
  ShieldCheck
} from 'lucide-react';
import { medicalRecordService } from '@/services/medical-record.service';
import { MedicalRecord } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MedicalRecordList() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { isDoctor, isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await medicalRecordService.getAll();
      setRecords(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch medical records.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = records.filter((r: any) => {
    const diag = (r.diagnosis || '').toLowerCase();
    const treat = (r.treatment || '').toLowerCase();
    const symp = (r.symptoms || '').toLowerCase();
    const pName = (r.patientName || (r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : '')).toLowerCase();
    const dName = (r.doctorName || (r.doctor ? `${r.doctor.firstName} ${r.doctor.lastName}` : '')).toLowerCase();
    const term = searchTerm.toLowerCase();

    if (!isPatient) {
      return diag.includes(term) || treat.includes(term) || pName.includes(term) || dName.includes(term);
    } else {
      return diag.includes(term) || treat.includes(term) || symp.includes(term) || dName.includes(term);
    }
  });

  const columns = [
    {
      header: 'Record #',
      accessor: (r: any) => <span className="font-bold text-slate-900">EHR-{r.id || r.recordId}</span>
    },
    ...(!isPatient ? [{
      header: 'Patient Name',
      accessor: (r: any) => {
        const pName = r.patientName || (r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : 'Patient');
        return <span className="font-semibold text-slate-900">{pName}</span>;
      }
    }] : []),
    {
      header: 'Attending Physician',
      accessor: (r: any) => {
        const dName = r.doctorName || (r.doctor ? `Dr. ${r.doctor.firstName} ${r.doctor.lastName}` : 'Physician');
        return <span className="font-bold text-slate-900">{dName}</span>;
      }
    },
    {
      header: 'Visit Date',
      accessor: (r: any) => <span className="text-xs text-slate-600 font-medium">{r.visitDate}</span>
    },
    {
      header: 'Primary Diagnosis',
      accessor: (r: any) => (
        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
          {r.diagnosis}
        </span>
      )
    },
    {
      header: 'Treatment Summary',
      accessor: (r: any) => <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">{r.treatment}</span>
    },
    {
      header: 'Actions',
      accessor: (r: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRecord(r)}
          className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View Chart
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPatient ? 'My Electronic Health Records' : 'Electronic Health Records & Clinical Charting'}
        description={
          isPatient
            ? 'Complete confidential timeline of your outpatient diagnoses, physician notes, and prescribed clinical treatments.'
            : 'Physician diagnostic documentation, reported symptoms, clinical findings, and clinical encounter notes.'
        }
        action={
          isDoctor && (
            <Button onClick={() => navigate('/medical-records/new')} className="bg-primary-700 hover:bg-primary-800 text-xs font-bold shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Document Clinical Note
            </Button>
          )
        }
      />

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder={isPatient ? 'Search diagnoses or treatments...' : 'Search by patient, doctor, or diagnosis...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs border-slate-200 bg-slate-50 focus-visible:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'timeline' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Timeline
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

      {/* Timeline View vs Table View */}
      {viewMode === 'timeline' ? (
        filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">No Clinical Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">No medical diagnostic records match your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rec: any) => {
              const id = rec.id || rec.recordId;
              const pName = rec.patientName || (rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : 'Patient');
              const dName = rec.doctorName || (rec.doctor ? `Dr. ${rec.doctor.firstName} ${rec.doctor.lastName}` : 'Physician');

              return (
                <Card
                  key={id}
                  className="bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                          RECORD #EHR-{id}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-600">
                          <Calendar className="h-3 w-3 text-primary-600" /> {rec.visitDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        {rec.diagnosis}
                      </h3>
                      {!isPatient && (
                        <p className="text-xs font-semibold text-slate-700">Patient: <span className="text-primary-800">{pName}</span></p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-slate-900">{dName}</p>
                        <p className="text-3xs text-slate-500 font-medium">Attending Consultant</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(rec)}
                        className="text-xs font-bold text-primary-700 h-8 border-slate-200 hover:bg-primary-50"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Full Chart
                      </Button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/90">
                      <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Reported Symptoms
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {rec.symptoms || 'No specific symptoms documented.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100/90">
                      <span className="text-3xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
                        Clinical Treatment & Protocol
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {rec.treatment || 'Observation & follow-up care advised.'}
                      </p>
                    </div>
                  </div>

                  {rec.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 text-2xs text-amber-900 font-medium">
                      <strong className="text-amber-950">Physician Notes:</strong> {rec.notes}
                    </div>
                  )}
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
          searchPlaceholder="Search records..."
        />
      )}

      {/* Full Clinical Chart Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-xl p-6 rounded-2xl bg-white border border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-primary-700">
              <ClipboardCheck className="h-4 w-4" /> Electronic Health Chart
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 mt-1">
              {selectedRecord?.diagnosis}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Encounter recorded on {selectedRecord?.visitDate} by{' '}
              {selectedRecord?.doctorName || (selectedRecord?.doctor ? `Dr. ${selectedRecord.doctor.firstName} ${selectedRecord.doctor.lastName}` : 'Physician')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Patient Name</span>
              <span className="text-slate-700 font-semibold">
                {selectedRecord?.patientName || (selectedRecord?.patient ? `${selectedRecord.patient.firstName} ${selectedRecord.patient.lastName}` : 'Confidential Patient')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Symptom Presentation</span>
              <p className="text-slate-700 leading-relaxed font-normal">
                {selectedRecord?.symptoms || 'None specified.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/60">
              <span className="font-bold text-teal-950 block mb-1">Prescribed Clinical Treatment</span>
              <p className="text-teal-900 leading-relaxed font-normal">
                {selectedRecord?.treatment || 'Observation & standard outpatient clinical care.'}
              </p>
            </div>

            {selectedRecord?.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                <span className="font-bold text-amber-950 block mb-1">Physician Clinical Notes (Confidential)</span>
                <p className="text-amber-900 leading-relaxed italic">
                  "{selectedRecord.notes}"
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
