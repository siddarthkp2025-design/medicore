import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const itemSchema = z.object({
  medicineId: z.number().min(1, 'Medicine is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
});

const schema = z.object({
  patientId: z.number().min(1, 'Patient is required'),
  doctorId: z.number(),
  recordId: z.number().optional(),
  prescriptionDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one medicine must be added'),
});

type FormData = z.infer<typeof schema>;

export default function PrescriptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorId: user?.userId || 0,
      prescriptionDate: new Date().toISOString().split('T')[0],
      items: [{ medicineId: 0, dosage: '', frequency: '', duration: '', instructions: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await prescriptionService.create(data);
      toast({ title: 'Success', description: 'Prescription created successfully.' });
      navigate('/prescriptions');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create prescription.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Write Prescription"
        description="Create a new prescription and add medicines."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input id="patientId" type="number" {...register('patientId', { valueAsNumber: true })} />
                {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordId">Medical Record ID (Optional)</Label>
                <Input id="recordId" type="number" {...register('recordId', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescriptionDate">Date *</Label>
                <Input id="prescriptionDate" type="date" {...register('prescriptionDate')} />
                {errors.prescriptionDate && <p className="text-sm text-destructive">{errors.prescriptionDate.message}</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">General Notes/Advice</Label>
                <Textarea id="notes" {...register('notes')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prescription Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ medicineId: 0, dosage: '', frequency: '', duration: '', instructions: '' })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Medicine
              </Button>
            </div>
            
            {errors.items?.root && <p className="text-sm text-destructive mb-4">{errors.items.root.message}</p>}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative flex flex-col md:flex-row gap-4 items-start">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700" 
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full pr-8">
                    <div className="space-y-2">
                      <Label>Medicine ID *</Label>
                      <Input type="number" {...register(`items.${index}.medicineId`, { valueAsNumber: true })} />
                      {errors.items?.[index]?.medicineId && <p className="text-xs text-destructive">{errors.items[index]?.medicineId?.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dosage *</Label>
                      <Input placeholder="e.g. 500mg" {...register(`items.${index}.dosage`)} />
                      {errors.items?.[index]?.dosage && <p className="text-xs text-destructive">{errors.items[index]?.dosage?.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frequency *</Label>
                      <Input placeholder="e.g. Twice a day" {...register(`items.${index}.frequency`)} />
                      {errors.items?.[index]?.frequency && <p className="text-xs text-destructive">{errors.items[index]?.frequency?.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duration *</Label>
                      <Input placeholder="e.g. 5 Days" {...register(`items.${index}.duration`)} />
                      {errors.items?.[index]?.duration && <p className="text-xs text-destructive">{errors.items[index]?.duration?.message}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Instructions (Optional)</Label>
                      <Input placeholder="e.g. Take after food" {...register(`items.${index}.instructions`)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/prescriptions')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Prescription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
