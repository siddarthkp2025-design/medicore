import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldAlert, FlaskConical, Pill } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function PrescriptionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await prescriptionService.getById(Number(id));
        setPrescription(data);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Access Denied: You cannot view this prescription.';
        setError(msg);
        toast({ variant: 'destructive', title: 'Prescription Error', description: msg });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPrescription();
  }, [id]);

  if (isLoading) return <LoadingSkeleton rows={15} />;

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white border border-red-200 rounded-xl text-center shadow-sm">
        <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600 mt-1 mb-5 leading-relaxed">{error}</p>
        <Button onClick={() => navigate('/prescriptions')} variant="outline" size="sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Prescriptions
        </Button>
      </div>
    );
  }

  if (!prescription) return null;

  const doctorName = prescription.doctorName ||
    (prescription.doctor ? `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}` : 'Physician');
  const patientName = prescription.patientName ||
    (prescription.patient ? `${prescription.patient.firstName} ${prescription.patient.lastName}` : 'Patient');
  const deptName = prescription.doctor?.department?.name || 'General Medicine';
  const items = prescription.items || [];

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" size="sm" onClick={() => navigate('/prescriptions')} className="text-xs">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Prescriptions
        </Button>
        <Button onClick={() => window.print()} className="bg-primary-700 hover:bg-primary-800 text-xs font-semibold">
          <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      <div className="bg-white p-8 sm:p-12 border border-slate-200 shadow-sm rounded-xl print:shadow-none print:border-none print:p-0">
        {/* Prescription Header */}
        <div className="flex justify-between items-start border-b-2 border-primary-700 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-black text-primary-800 tracking-tight">MediCore HMS</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Clinical Outpatient Pharmacy Order</p>
            <p className="text-xs text-slate-500">Connaught Place Medical Enclave, New Delhi</p>
            <p className="text-xs text-slate-500">Tel: +91 11 2345 0100</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-900">{doctorName}</h2>
            <p className="text-xs font-semibold text-primary-700">{deptName}</p>
            {prescription.doctor?.qualification && (
              <p className="text-2xs text-slate-500">{prescription.doctor.qualification}</p>
            )}
            <p className="text-2xs text-slate-500">Reg No: DOC-{(prescription.doctorId || prescription.doctor?.id || '2001')}</p>
          </div>
        </div>

        {/* Patient & Prescription Info */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase text-2xs mb-0.5">Patient Details</p>
            <p className="font-bold text-sm text-slate-900">{patientName}</p>
            <p className="text-slate-600 mt-0.5">
              Age / Gender: {prescription.patient?.gender || 'Adult'}
            </p>
            {prescription.patient?.bloodGroup && (
              <p className="text-slate-600">Blood Group: <span className="font-semibold text-primary-700">{prescription.patient.bloodGroup}</span></p>
            )}
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-semibold uppercase text-2xs mb-0.5">Order Info</p>
            <p className="font-bold text-slate-900 text-sm">Rx #{prescription.id || prescription.prescriptionId}</p>
            <p className="text-slate-600 mt-0.5">Date: {prescription.prescriptionDate}</p>
          </div>
        </div>

        {/* Rx Symbol & Medication Items */}
        <div className="mb-8">
          <div className="text-2xl font-serif font-black text-primary-800 mb-4 tracking-wider">℞</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50/70 text-xs">
                <th className="py-2.5 px-3 text-slate-700 font-bold">#</th>
                <th className="py-2.5 px-3 text-slate-700 font-bold">Medication Name</th>
                <th className="py-2.5 px-3 text-slate-700 font-bold">Dosage</th>
                <th className="py-2.5 px-3 text-slate-700 font-bold">Frequency</th>
                <th className="py-2.5 px-3 text-slate-700 font-bold">Duration</th>
                <th className="py-2.5 px-3 text-slate-700 font-bold">Instructions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">
                    No medication items specified
                  </td>
                </tr>
              ) : (
                items.map((item: any, idx: number) => {
                  const medName = item.medicineName || item.medicine?.name || `Medication Item ${idx + 1}`;
                  return (
                    <tr key={idx}>
                      <td className="py-3 px-3 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{medName}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{item.dosage}</td>
                      <td className="py-3 px-3 text-slate-600">{item.frequency}</td>
                      <td className="py-3 px-3 text-slate-600">{item.duration}</td>
                      <td className="py-3 px-3 text-slate-500 italic">{item.instructions || 'As directed'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clinical Advice / Notes */}
        {prescription.notes && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs">
            <span className="font-bold text-amber-900 block mb-1">Doctor's Clinical Advice:</span>
            <p className="text-amber-900 leading-relaxed">{prescription.notes}</p>
          </div>
        )}

        {/* Sign-off */}
        <div className="mt-16 flex justify-between items-end pt-6 border-t border-slate-200 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">MediCore Outpatient Pharmacy</p>
            <p className="text-2xs">Dispensed by licensed pharmacist under doctor order</p>
          </div>
          <div className="text-center">
            <div className="w-44 border-b border-slate-400 mb-1.5" />
            <p className="font-bold text-slate-800">{doctorName}</p>
            <p className="text-2xs text-slate-400">Authorized Physician Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
