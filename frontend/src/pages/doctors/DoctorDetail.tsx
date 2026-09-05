import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Doctor } from '@/types';
import { doctorService } from '@/services/doctor.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { User, Phone, Mail, Award, Calendar, Clock, Stethoscope } from 'lucide-react';

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      doctorService.getById(Number(id))
        .then(data => setDoctor(data))
        .catch(err => console.error('Failed to load doctor', err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading || !doctor) return <LoadingSkeleton rows={10} />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
        description={`${doctor.specialization} • ${doctor.departmentName || 'Medical Staff'}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 shadow-sm">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm">
                <Stethoscope className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Dr. {doctor.firstName} {doctor.lastName}</CardTitle>
            <div className="flex justify-center mt-2">
              <StatusBadge status={doctor.status} />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.qualification}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.experienceYears} Years Experience</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Clinical Specialization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-semibold">{doctor.departmentName || 'General Medicine'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Specialization</p>
              <p className="text-sm font-semibold">{doctor.specialization}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Qualifications & Credentials</p>
              <p className="text-sm font-semibold">{doctor.qualification}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Joining</p>
              <p className="text-sm font-semibold">{doctor.joiningDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
