import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { admissionService } from '@/services/admission.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  patientId: z.number().min(1, 'Patient is required'),
  roomId: z.number().min(1, 'Room is required'),
  doctorId: z.number().min(1, 'Doctor is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  expectedDischargeDate: z.string().min(1, 'Expected discharge date is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
});

type FormData = z.infer<typeof schema>;

export default function AdmissionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await admissionService.create(data);
      toast({ title: 'Success', description: 'Patient admitted successfully.' });
      navigate('/admissions');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to admit patient.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Admit Patient"
        description="Create a new admission record and allocate a room."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input id="patientId" type="number" {...register('patientId', { valueAsNumber: true })} />
                {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Available Room ID *</Label>
                <Input id="roomId" type="number" {...register('roomId', { valueAsNumber: true })} />
                {errors.roomId && <p className="text-sm text-destructive">{errors.roomId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorId">Attending Doctor ID *</Label>
                <Input id="doctorId" type="number" {...register('doctorId', { valueAsNumber: true })} />
                {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
              </div>
              
              <div className="space-y-2"></div> {/* spacer */}

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date *</Label>
                <Input id="admissionDate" type="date" {...register('admissionDate')} />
                {errors.admissionDate && <p className="text-sm text-destructive">{errors.admissionDate.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedDischargeDate">Expected Discharge *</Label>
                <Input id="expectedDischargeDate" type="date" {...register('expectedDischargeDate')} />
                {errors.expectedDischargeDate && <p className="text-sm text-destructive">{errors.expectedDischargeDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
              <Textarea id="diagnosis" {...register('diagnosis')} />
              {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/admissions')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Admitting...' : 'Admit Patient'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
