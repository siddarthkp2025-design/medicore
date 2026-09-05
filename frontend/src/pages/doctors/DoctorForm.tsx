import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doctorService } from '@/services/doctor.service';
import { departmentService } from '@/services/department.service';
import { Department } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  specialization: z.string().min(2, 'Specialization is required'),
  departmentId: z.number().min(1, 'Department is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  experienceYears: z.number().min(0, 'Experience must be positive'),
  status: z.string().min(1, 'Status is required'),
});

type FormData = z.infer<typeof schema>;

export default function DoctorForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      experienceYears: 0,
      status: 'ACTIVE'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await departmentService.getAll();
        setDepartments(deptRes.content || [{ departmentId: 1, name: 'Cardiology', description: '', location: '', phone: '', isActive: true, doctorCount: 0 }]);
        
        if (isEdit && id) {
          const doc = await doctorService.getById(Number(id));
          if (doc) {
            setValue('firstName', doc.firstName);
            setValue('lastName', doc.lastName);
            setValue('email', doc.email);
            setValue('phone', doc.phone);
            setValue('specialization', doc.specialization);
            setValue('departmentId', doc.departmentId);
            setValue('qualification', doc.qualification);
            setValue('experienceYears', doc.experienceYears);
            setValue('status', doc.status || 'Active');
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data.' });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await doctorService.update(Number(id), data);
        toast({ title: 'Success', description: 'Doctor updated successfully.' });
      } else {
        await doctorService.create(data);
        toast({ title: 'Success', description: 'Doctor created successfully.' });
      }
      navigate('/doctors');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save doctor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={8} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit Doctor' : 'Add New Doctor'}
        description="Enter the doctor's professional and contact information."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Department *</Label>
                <Select onValueChange={(val) => setValue('departmentId', Number(val))} defaultValue={isEdit ? "1" : undefined}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input id="specialization" {...register('specialization')} />
                {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input id="qualification" {...register('qualification')} />
                {errors.qualification && <p className="text-sm text-destructive">{errors.qualification.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience (Years) *</Label>
                <Input id="experienceYears" type="number" {...register('experienceYears', { valueAsNumber: true })} />
                {errors.experienceYears && <p className="text-sm text-destructive">{errors.experienceYears.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select onValueChange={(val) => setValue('status', val)} defaultValue={isEdit ? 'ACTIVE' : 'ACTIVE'}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/doctors')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Doctor'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
