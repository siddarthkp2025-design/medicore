import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { medicineService } from '@/services/medicine.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(2, 'Category is required'),
  manufacturer: z.string().min(2, 'Manufacturer is required'),
  unitPrice: z.number().min(0, 'Price must be non-negative'),
  stockQuantity: z.number().min(0, 'Stock cannot be negative'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  reorderLevel: z.number().min(0, 'Reorder level cannot be negative'),
});

type FormData = z.infer<typeof schema>;

export default function MedicineForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isEdit && id) {
      medicineService.getById(Number(id))
        .then(med => {
          if (med) {
            setValue('name', med.name);
            setValue('category', med.category || '');
            setValue('manufacturer', med.manufacturer || '');
            setValue('unitPrice', med.unitPrice);
            setValue('stockQuantity', med.stockQuantity);
            setValue('expiryDate', med.expiryDate);
            setValue('reorderLevel', med.reorderLevel);
          }
        })
        .catch(err => console.error('Failed to load medicine', err))
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await medicineService.update(Number(id), data);
        toast({ title: 'Success', description: 'Medicine updated successfully.' });
      } else {
        await medicineService.create(data);
        toast({ title: 'Success', description: 'Medicine created successfully.' });
      }
      navigate('/medicines');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save medicine.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit Medicine' : 'Add New Medicine'}
        description="Enter medicine details."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" {...register('category')} />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input id="manufacturer" {...register('manufacturer')} />
                {errors.manufacturer && <p className="text-sm text-destructive">{errors.manufacturer.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                <Input id="unitPrice" type="number" step="0.01" {...register('unitPrice', { valueAsNumber: true })} />
                {errors.unitPrice && <p className="text-sm text-destructive">{errors.unitPrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input id="stockQuantity" type="number" {...register('stockQuantity', { valueAsNumber: true })} />
                {errors.stockQuantity && <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input id="reorderLevel" type="number" {...register('reorderLevel', { valueAsNumber: true })} />
                {errors.reorderLevel && <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input id="expiryDate" type="date" {...register('expiryDate')} />
                {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/medicines')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Medicine'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
