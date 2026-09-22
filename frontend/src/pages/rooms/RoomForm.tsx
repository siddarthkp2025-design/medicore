import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { roomService } from '@/services/room.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

const ROOM_TYPES = [
  'General Ward',
  'Semi Private',
  'Private',
  'ICU',
  'Emergency'
] as const;

const ROOM_STATUSES = [
  'Available',
  'Occupied',
  'Maintenance'
] as const;

const schema = z.object({
  roomNumber: z.string().trim().min(1, 'Room number is required'),
  roomType: z.enum(ROOM_TYPES, { errorMap: () => ({ message: 'Please select a valid room type' }) }),
  floorNumber: z.number({ invalid_type_error: 'Floor number is required' }).min(0, 'Floor must be 0 or greater'),
  dailyCharge: z.number({ invalid_type_error: 'Tariff is required' }).min(1, 'Daily charge must be greater than 0'),
  status: z.enum(ROOM_STATUSES, { errorMap: () => ({ message: 'Please select a valid status' }) }),
});

type FormData = z.infer<typeof schema>;

export default function RoomForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomNumber: '',
      roomType: 'General Ward',
      floorNumber: 1,
      dailyCharge: 1000,
      status: 'Available',
    }
  });

  const selectedRoomType = watch('roomType');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (isEdit && id) {
      roomService.getById(Number(id))
        .then(room => {
          if (room) {
            // Find case-insensitive match for roomType and status
            const matchedType = ROOM_TYPES.find(t => t.toLowerCase() === (room.roomType || '').toLowerCase()) || 'General Ward';
            const matchedStatus = ROOM_STATUSES.find(s => s.toLowerCase() === (room.status || '').toLowerCase()) || 'Available';

            reset({
              roomNumber: room.roomNumber || '',
              roomType: matchedType,
              floorNumber: Number(room.floorNumber) || 1,
              dailyCharge: Number(room.dailyCharge) || 1000,
              status: matchedStatus,
            });
          }
        })
        .catch(err => {
          console.error('Failed to load room details', err);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to load room details.' });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, reset, toast]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        roomNumber: data.roomNumber.trim(),
        roomType: data.roomType,
        floorNumber: Number(data.floorNumber),
        dailyCharge: Number(data.dailyCharge),
        status: data.status,
      };

      if (isEdit) {
        await roomService.update(Number(id), payload as any);
        toast({ title: 'Success', description: `Room ${payload.roomNumber} updated successfully.` });
      } else {
        await roomService.create(payload as any);
        toast({ title: 'Success', description: `Room ${payload.roomNumber} added to inventory.` });
      }
      navigate('/rooms');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save room details.';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    console.error('RoomForm validation errors:', formErrors);
    const firstErrorMessage = Object.values(formErrors)[0] as any;
    toast({
      variant: 'destructive',
      title: 'Validation Error',
      description: firstErrorMessage?.message || 'Please check required fields.'
    });
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit Inpatient Room' : 'Add Inpatient Room'}
        description="Configure inpatient bed, ward type, floor location, and daily tariff."
      />

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Number */}
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room / Bed Identifier *</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g. 101, ICU-01, 204-B"
                  {...register('roomNumber')}
                />
                {errors.roomNumber && (
                  <p className="text-xs text-destructive font-medium">{errors.roomNumber.message}</p>
                )}
              </div>

              {/* Ward / Room Type */}
              <div className="space-y-2">
                <Label htmlFor="roomType">Ward / Room Category *</Label>
                <Select
                  value={selectedRoomType}
                  onValueChange={(val: any) => setValue('roomType', val, { shouldValidate: true })}
                >
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomType && (
                  <p className="text-xs text-destructive font-medium">{errors.roomType.message}</p>
                )}
              </div>

              {/* Floor Number */}
              <div className="space-y-2">
                <Label htmlFor="floorNumber">Floor Number *</Label>
                <Input
                  id="floorNumber"
                  type="number"
                  min={0}
                  max={20}
                  placeholder="e.g. 1, 2, 3"
                  {...register('floorNumber', { valueAsNumber: true })}
                />
                {errors.floorNumber && (
                  <p className="text-xs text-destructive font-medium">{errors.floorNumber.message}</p>
                )}
              </div>

              {/* Daily Tariff */}
              <div className="space-y-2">
                <Label htmlFor="dailyCharge">Daily Tariff / Charge (₹) *</Label>
                <Input
                  id="dailyCharge"
                  type="number"
                  step="50"
                  min={1}
                  placeholder="e.g. 1200"
                  {...register('dailyCharge', { valueAsNumber: true })}
                />
                {errors.dailyCharge && (
                  <p className="text-xs text-destructive font-medium">{errors.dailyCharge.message}</p>
                )}
              </div>

              {/* Occupancy Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">Initial Room Status *</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(val: any) => setValue('status', val, { shouldValidate: true })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select initial status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-destructive font-medium">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/rooms')}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-700 hover:bg-primary-800 text-xs font-bold min-w-[120px]"
              >
                {isSubmitting ? 'Saving Room...' : isEdit ? 'Update Room' : 'Add Room to Inventory'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
