import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, User, Pill, Calendar, FileText } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { patientService } from '@/services/patient.service';
import { medicineService } from '@/services/medicine.service';
import api from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Patient, Medicine } from '@/types';

const itemSchema = z.object({
  medicineId: z.number().min(1, 'Please select or enter a valid medicine'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 500mg)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Twice daily)'),
  duration: z.string().min(1, 'Duration is required (e.g. 5 Days)'),
  instructions: z.string().optional(),
});

const schema = z.object({
  patientId: z.number().min(1, 'Please select a patient'),
  recordId: z.number().optional(),
  prescriptionDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one medicine must be added'),
});

type FormData = z.infer<typeof schema>;

export default function PrescriptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: undefined,
      recordId: undefined,
      prescriptionDate: new Date().toISOString().split('T')[0],
      items: [{ medicineId: 0, dosage: '', frequency: '', duration: '', instructions: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patRes, medRes, recRes] = await Promise.all([
          patientService.getAll(),
          medicineService.getAll(),
          api.get('/medical-records').catch(() => ({ data: [] }))
        ]);
        const patList = patRes?.content || (Array.isArray(patRes) ? patRes : []);
        const medList = medRes?.content || (Array.isArray(medRes) ? medRes : []);
        const recList = Array.isArray(recRes?.data) ? recRes.data : (recRes?.data?.content || []);
        setPatients(patList);
        setMedicines(medList);
        setRecords(recList);

        if (patList.length > 0) {
          const firstPatId = Number((patList[0] as any).id ?? patList[0].patientId);
          setValue('patientId', firstPatId);
        }
      } catch (err) {
        console.error('Failed to load patients/medicines for prescription form', err);
      }
    };
    loadData();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await prescriptionService.create(data);
      toast({ title: 'Prescription Created', description: 'Clinical prescription issued successfully.' });
      navigate('/prescriptions');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create prescription.';
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientId = watch('patientId');
  const selectedRecordId = watch('recordId');

  // Filter records for the selected patient
  const patientRecords = records.filter(r => {
    if (!selectedPatientId) return true;
    const patId = Number(r.patient?.id ?? r.patientId);
    return patId === Number(selectedPatientId);
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Write Prescription"
        description="Prescribe medication and treatment instructions for an outpatient encounter."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6 border border-slate-200 shadow-2xs">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Patient Selection Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary-600" /> Patient *
                </Label>
                <select
                  id="patientId"
                  value={selectedPatientId ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setValue('patientId', val as any, { shouldValidate: true });
                    setValue('recordId', undefined);
                  }}
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

              {/* Medical Record Dropdown (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="recordId" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary-600" /> Clinical Encounter / Record
                </Label>
                <select
                  id="recordId"
                  value={selectedRecordId ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setValue('recordId', val);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">-- None / General Prescription --</option>
                  {patientRecords.map(rec => {
                    const rId = Number(rec.id ?? rec.recordId);
                    const dateStr = rec.visitDate ? ` (${rec.visitDate})` : '';
                    const diagStr = rec.diagnosis ? ` - ${rec.diagnosis}` : '';
                    return (
                      <option key={rId} value={rId}>
                        Record #{rId}{dateStr}{diagStr}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Prescription Date */}
              <div className="space-y-2">
                <Label htmlFor="prescriptionDate" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary-600" /> Prescription Date *
                </Label>
                <Input
                  id="prescriptionDate"
                  type="date"
                  {...register('prescriptionDate')}
                  className="h-10 text-xs font-semibold border-slate-200"
                />
                {errors.prescriptionDate && <p className="text-2xs text-rose-600 font-semibold">{errors.prescriptionDate.message}</p>}
              </div>

              {/* General Notes/Advice */}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700">General Notes / Clinical Advice</Label>
                <Textarea
                  id="notes"
                  placeholder="Dietary instructions, precautions, or special clinical remarks..."
                  {...register('notes')}
                  rows={2}
                  className="text-xs border-slate-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescription Items */}
        <Card className="border border-slate-200 shadow-2xs">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary-600" /> Prescribed Medications & Dosages
              </h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ medicineId: 0, dosage: '', frequency: '', duration: '', instructions: '' })}
                className="text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Medicine
              </Button>
            </div>
            
            {errors.items?.root && <p className="text-xs text-rose-600 font-semibold mb-4">{errors.items.root.message}</p>}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const currentMedId = watch(`items.${index}.medicineId`);
                return (
                  <div key={field.id} className="p-4 border border-slate-200 rounded-lg relative bg-slate-50/50 flex flex-col md:flex-row gap-4 items-start">
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-7 w-7" 
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full pr-8">
                      {/* Medicine Dropdown / Selector */}
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-semibold text-slate-700">Medicine *</Label>
                        <select
                          value={currentMedId || ''}
                          onChange={(e) => setValue(`items.${index}.medicineId`, Number(e.target.value), { shouldValidate: true })}
                          className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          <option value="">-- Select Medication from Pharmacy --</option>
                          {medicines.map(m => {
                            const mId = Number((m as any).id ?? m.medicineId);
                            return (
                              <option key={mId} value={mId}>
                                {m.name} ({m.category || 'Medicine'} • Stock: {m.stockQuantity ?? 'Available'})
                              </option>
                            );
                          })}
                        </select>
                        {errors.items?.[index]?.medicineId && (
                          <p className="text-2xs text-rose-600 font-semibold">{errors.items[index]?.medicineId?.message}</p>
                        )}
                      </div>
                      
                      {/* Dosage */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Dosage *</Label>
                        <Input
                          placeholder="e.g. 500mg / 1 tab"
                          {...register(`items.${index}.dosage`)}
                          className="h-9 text-xs border-slate-200"
                        />
                        {errors.items?.[index]?.dosage && (
                          <p className="text-2xs text-rose-600 font-semibold">{errors.items[index]?.dosage?.message}</p>
                        )}
                      </div>
                      
                      {/* Frequency */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Frequency *</Label>
                        <Input
                          placeholder="e.g. Twice daily (1-0-1)"
                          {...register(`items.${index}.frequency`)}
                          className="h-9 text-xs border-slate-200"
                        />
                        {errors.items?.[index]?.frequency && (
                          <p className="text-2xs text-rose-600 font-semibold">{errors.items[index]?.frequency?.message}</p>
                        )}
                      </div>
                      
                      {/* Duration */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Duration *</Label>
                        <Input
                          placeholder="e.g. 5 Days / 1 Week"
                          {...register(`items.${index}.duration`)}
                          className="h-9 text-xs border-slate-200"
                        />
                        {errors.items?.[index]?.duration && (
                          <p className="text-2xs text-rose-600 font-semibold">{errors.items[index]?.duration?.message}</p>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1.5 md:col-span-3">
                        <Label className="text-xs font-semibold text-slate-700">Instructions (Optional)</Label>
                        <Input
                          placeholder="e.g. Take after meals with warm water"
                          {...register(`items.${index}.instructions`)}
                          className="h-9 text-xs border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => navigate('/prescriptions')} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary-700 hover:bg-primary-800 text-white">
                {isSubmitting ? 'Saving Prescription...' : 'Save Prescription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
