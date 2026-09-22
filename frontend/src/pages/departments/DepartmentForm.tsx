import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { departmentService } from '@/services/department.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

const schema = z.object({
  name: z.string().trim().min(2, 'Department name is required'),
  description: z.string().optional(),
  location: z.string().trim().min(2, 'Location is required'),
  phone: z.string().trim().min(3, 'Phone/Extension is required'),
  isActive: z.union([z.boolean(), z.number()]).transform((v) => Boolean(v)),
});

type FormData = z.infer<typeof schema>;

export default function DepartmentForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      phone: '',
      isActive: true,
    }
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (isEdit && id) {
      departmentService.getById(Number(id))
        .then(dept => {
          if (dept) {
            const isDeptActive = (dept.isActive as any) === 1 || dept.isActive === true || String(dept.isActive) === '1';
            reset({
              name: dept.name || '',
              description: dept.description || '',
              location: dept.location || '',
              phone: dept.phone || '',
              isActive: isDeptActive,
            });
          }
        })
        .catch(err => {
          console.error('Failed to load department', err);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to load department details.' });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, reset, toast]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        location: data.location.trim(),
        phone: data.phone.trim(),
        isActive: data.isActive ? 1 : 0,
      };

      if (isEdit) {
        await departmentService.update(Number(id), payload as any);
        toast({ title: 'Success', description: 'Department updated successfully.' });
      } else {
        await departmentService.create(payload as any);
        toast({ title: 'Success', description: 'Department created successfully.' });
      }
      navigate('/departments');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save department.';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    console.error('DepartmentForm validation errors:', formErrors);
    const firstErrorMessage = Object.values(formErrors)[0] as any;
    toast({
      variant: 'destructive',
      title: 'Validation Error',
      description: firstErrorMessage?.message || 'Please check the required fields.'
    });
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit Department' : 'Add New Department'}
        description="Enter the department details."
      />

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" {...register('location')} />
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone/Extension *</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="isActive" 
                checked={Boolean(isActive)}
                onCheckedChange={(checked) => setValue('isActive', checked, { shouldValidate: true, shouldDirty: true })}
              />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
            {errors.isActive && <p className="text-sm text-destructive">{errors.isActive.message}</p>}

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/departments')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                {isSubmitting ? 'Saving Department...' : 'Save Department'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
