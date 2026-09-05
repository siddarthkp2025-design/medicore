import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { medicalRecordService } from '@/services/medical-record.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  patientId: z.number().min(1, 'Patient is required'),
  doctorId: z.number().min(1, 'Doctor is required'),
  visitDate: z.string().min(1, 'Date is required'),
  symptoms: z.string().min(1, 'Symptoms are required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  treatment: z.string().min(1, 'Treatment is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function MedicalRecordForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await medicalRecordService.create(data);
      toast({ title: 'Success', description: 'Medical record added successfully.' });
      navigate('/medical-records');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add medical record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Add Medical Record"
        description="Create a new medical record for a patient's visit."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input id="patientId" type="number" {...register('patientId', { valueAsNumber: true })} />
                {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorId">Doctor ID *</Label>
                <Input id="doctorId" type="number" {...register('doctorId', { valueAsNumber: true })} />
                {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date *</Label>
                <Input id="visitDate" type="date" {...register('visitDate')} />
                {errors.visitDate && <p className="text-sm text-destructive">{errors.visitDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms *</Label>
              <Textarea id="symptoms" {...register('symptoms')} />
              {errors.symptoms && <p className="text-sm text-destructive">{errors.symptoms.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea id="diagnosis" {...register('diagnosis')} />
              {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan *</Label>
              <Textarea id="treatment" {...register('treatment')} />
              {errors.treatment && <p className="text-sm text-destructive">{errors.treatment.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/medical-records')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Record'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
