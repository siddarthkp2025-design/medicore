import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { billService } from '@/services/bill.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  patientId: z.number().min(1, 'Patient is required'),
  appointmentId: z.number().optional(),
  admissionId: z.number().optional(),
  consultationCharge: z.number().min(0, 'Cannot be negative'),
  roomCharge: z.number().min(0, 'Cannot be negative'),
  medicineCharge: z.number().min(0, 'Cannot be negative'),
  otherCharges: z.number().min(0, 'Cannot be negative'),
  discount: z.number().min(0, 'Cannot be negative'),
  tax: z.number().min(0, 'Cannot be negative'),
});

type FormData = z.infer<typeof schema>;

export default function BillForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consultationCharge: 0,
      roomCharge: 0,
      medicineCharge: 0,
      otherCharges: 0,
      discount: 0,
      tax: 0
    }
  });

  const watchAllFields = watch();

  useEffect(() => {
    const subtotal = 
      (Number(watchAllFields.consultationCharge) || 0) + 
      (Number(watchAllFields.roomCharge) || 0) + 
      (Number(watchAllFields.medicineCharge) || 0) + 
      (Number(watchAllFields.otherCharges) || 0);
    
    const discountAmount = Number(watchAllFields.discount) || 0;
    const taxAmount = Number(watchAllFields.tax) || 0;
    
    setTotal(subtotal - discountAmount + taxAmount);
  }, [watchAllFields]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await billService.create({ ...data, totalAmount: total, paymentStatus: 'PENDING', billingDate: new Date().toISOString(), items: [] });
      toast({ title: 'Success', description: 'Bill generated successfully.' });
      navigate('/billing');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate bill.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Generate Bill"
        description="Create a new invoice for a patient."
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
                <Label htmlFor="appointmentId">Appointment ID</Label>
                <Input id="appointmentId" type="number" {...register('appointmentId', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input id="admissionId" type="number" {...register('admissionId', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Consultation Charge (₹)</Label>
                  <Input type="number" {...register('consultationCharge', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Room Charge (₹)</Label>
                  <Input type="number" {...register('roomCharge', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Medicine Charge (₹)</Label>
                  <Input type="number" {...register('medicineCharge', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Other Charges (₹)</Label>
                  <Input type="number" {...register('otherCharges', { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input type="number" {...register('discount', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Tax (₹)</Label>
                  <Input type="number" {...register('tax', { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-b py-6 bg-slate-50/50 -mx-6 px-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/billing')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Generating...' : 'Generate Bill'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
