import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient } from '@/types';
import { patientService } from '@/services/patient.service';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { User, Phone, Mail, MapPin, Droplet, Calendar, AlertCircle } from 'lucide-react';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      patientService.getById(Number(id))
        .then(data => setPatient(data))
        .catch(err => console.error('Failed to load patient profile', err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading || !patient) return <LoadingSkeleton rows={10} />;

  const age = patient.dateOfBirth 
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() 
    : 'N/A';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${patient.firstName} ${patient.lastName}`} 
        description={`Patient Record ID: #${patient.patientId}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 shadow-sm">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">{patient.firstName} {patient.lastName}</CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-xs bg-white px-2 py-1 rounded-full border">{patient.gender}</span>
              <span className="text-xs bg-white px-2 py-1 rounded-full border">{age} years</span>
              {patient.bloodGroup && (
                <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-full border border-rose-200">
                  {patient.bloodGroup}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email || 'No email registered'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{patient.address || 'Address not recorded'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Registered: {patient.registrationDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Emergency Contacts & Medical Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Emergency Contact</p>
              <p className="text-sm font-bold text-slate-900">{patient.emergencyContactName || 'None listed'}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary-600" /> {patient.emergencyContactPhone || 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Blood Group</p>
                <p className="text-sm font-semibold text-rose-600">{patient.bloodGroup || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="text-sm font-semibold">{patient.dateOfBirth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
