import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientService } from '@/services/patient.service';
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
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  bloodGroup: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PatientForm() {
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
      patientService.getById(Number(id))
        .then(p => {
          if (p) {
            setValue('firstName', p.firstName);
            setValue('lastName', p.lastName);
            setValue('dateOfBirth', p.dateOfBirth);
            setValue('gender', p.gender);
            setValue('bloodGroup', p.bloodGroup || 'O+');
            setValue('phone', p.phone);
            setValue('email', p.email || '');
            setValue('address', p.address || '');
            setValue('emergencyContactName', p.emergencyContactName || '');
            setValue('emergencyContactPhone', p.emergencyContactPhone || '');
          }
        })
        .catch(err => console.error('Failed to load patient profile', err))
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await patientService.update(Number(id), data);
        toast({ title: 'Success', description: 'Patient updated successfully.' });
      } else {
        await patientService.create(data);
        toast({ title: 'Success', description: 'Patient created successfully.' });
      }
      navigate('/patients');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save patient.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={10} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit Patient' : 'Add New Patient'}
        description="Enter the patient's personal and contact information."
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
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(val) => setValue('gender', val)} defaultValue={isEdit ? 'Male' : undefined}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(val) => setValue('bloodGroup', val)} defaultValue={isEdit ? 'O+' : undefined}>
                  <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" {...register('emergencyContactName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/patients')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Patient'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
