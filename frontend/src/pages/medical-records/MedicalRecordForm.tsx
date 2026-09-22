import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { medicalRecordService } from '@/services/medical-record.service';
import { patientService } from '@/services/patient.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Patient } from '@/types';
import { User, Calendar, Activity, ClipboardList } from 'lucide-react';

const schema = z.object({
  patientId: z.number().min(1, 'Please select a patient'),
  doctorId: z.number().optional(),
  visitDate: z.string().min(1, 'Visit date is required'),
  symptoms: z.string().min(1, 'Symptoms are required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  treatment: z.string().min(1, 'Treatment plan is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function MedicalRecordForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isDoctor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: undefined,
      doctorId: undefined,
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      treatment: '',
      notes: '',
    }
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patRes = await patientService.getAll();
        const patList = patRes?.content || (Array.isArray(patRes) ? patRes : []);
        setPatients(patList);
        if (patList.length > 0) {
          const firstPatId = Number((patList[0] as any).id ?? patList[0].patientId);
          setValue('patientId', firstPatId);
        }
      } catch (err) {
        console.error('Failed to load patients for medical record form', err);
      }
    };
    loadPatients();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await medicalRecordService.create(data);
      toast({ title: 'Record Saved', description: 'Clinical encounter and diagnosis recorded successfully.' });
      navigate('/medical-records');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to add medical record.';
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientId = watch('patientId');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Add Medical Record"
        description="Document clinical symptoms, diagnosis, and treatment for an outpatient encounter."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-slate-200 shadow-2xs">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Patient Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary-600" /> Patient *
                </Label>
                <select
                  id="patientId"
                  value={selectedPatientId ?? ''}
                  onChange={(e) => setValue('patientId', Number(e.target.value), { shouldValidate: true })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => {
                    const pId = Number((p as any).id ?? p.patientId);
                    return (
                      <option key={pId} value={pId}>
                        {p.firstName} {p.lastName} (ID: {pId})
                      </option>
                    );
                  })}
                </select>
                {errors.patientId && <p className="text-2xs text-rose-600 font-semibold">{errors.patientId.message}</p>}
              </div>

              {/* Visit Date */}
              <div className="space-y-2">
                <Label htmlFor="visitDate" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary-600" /> Encounter Date *
                </Label>
                <Input
                  id="visitDate"
                  type="date"
                  {...register('visitDate')}
                  className="h-10 text-xs font-semibold border-slate-200"
                />
                {errors.visitDate && <p className="text-2xs text-rose-600 font-semibold">{errors.visitDate.message}</p>}
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary-600" /> Chief Medical Complaint / Symptoms *
              </Label>
              <Textarea
                id="symptoms"
                placeholder="Patient presented with fever, cough, joint pain..."
                {...register('symptoms')}
                rows={3}
                className="text-xs border-slate-200"
              />
              {errors.symptoms && <p className="text-2xs text-rose-600 font-semibold">{errors.symptoms.message}</p>}
            </div>

            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-primary-600" /> Clinical Diagnosis *
              </Label>
              <Textarea
                id="diagnosis"
                placeholder="Confirmed diagnosis (e.g. Acute Viral Bronchitis, ICD-10 J20)..."
                {...register('diagnosis')}
                rows={2}
                className="text-xs border-slate-200"
              />
              {errors.diagnosis && <p className="text-2xs text-rose-600 font-semibold">{errors.diagnosis.message}</p>}
            </div>

            {/* Treatment Plan */}
            <div className="space-y-2">
              <Label htmlFor="treatment" className="text-xs font-bold text-slate-700">Treatment Plan & Clinical Management *</Label>
              <Textarea
                id="treatment"
                placeholder="Prescribed rest, oral rehydration, antibiotic regimen..."
                {...register('treatment')}
                rows={3}
                className="text-xs border-slate-200"
              />
              {errors.treatment && <p className="text-2xs text-rose-600 font-semibold">{errors.treatment.message}</p>}
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Progress Notes & Follow-up Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Advised review after 5 days if fever persists..."
                {...register('notes')}
                rows={2}
                className="text-xs border-slate-200"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => navigate('/medical-records')} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary-700 hover:bg-primary-800 text-white">
                {isSubmitting ? 'Saving Encounter...' : 'Save Medical Record'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
