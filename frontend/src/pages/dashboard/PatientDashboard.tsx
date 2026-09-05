import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FileText,
  FlaskConical,
  Receipt,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  CreditCard,
  Pill,
  HeartPulse,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { reportService } from '@/services/report.service';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function PatientDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const data = await reportService.getPatientDashboard();
        setStats(data);
      } catch (error) {
        console.error('Error fetching patient dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientData();
  }, []);

  if (isLoading) return <LoadingSkeleton rows={10} />;

  const upcomingAppt = stats?.upcomingAppointment;
  const apptHistory = stats?.appointmentHistory || [];
  const recentRecord = stats?.recentMedicalRecord;
  const activePrescriptions = stats?.activePrescriptions || [];
  const outstandingBills = stats?.outstandingBills || [];

  const upcomingDoctorName = upcomingAppt?.doctorName ||
    (upcomingAppt?.doctor ? `Dr. ${upcomingAppt.doctor.firstName} ${upcomingAppt.doctor.lastName}` : null);

  const upcomingDeptName = upcomingAppt?.departmentName || upcomingAppt?.doctor?.department?.name || 'Specialist Consultation';

  return (
    <div className="space-y-6">
      {/* Personalized Health Portal Greeting Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-primary-900 to-teal-900 p-7 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-2xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>Personal Confidential Health Record</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {user?.fullName || 'Patient'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your centralized patient care dashboard. Review your upcoming doctor appointments, verified clinical diagnoses, medication regimens, and billing statements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => navigate('/appointments/new')}
              className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs h-10 px-4 shadow-sm transition-all"
            >
              <Calendar className="mr-2 h-4 w-4 text-slate-950" /> Schedule Visit
            </Button>
            <Button
              onClick={() => navigate('/billing')}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold text-xs h-10 px-4 backdrop-blur-xs"
            >
              <Receipt className="mr-2 h-4 w-4 text-teal-300" /> My Invoices
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Health KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Visit"
          value={upcomingAppt ? upcomingAppt.appointmentDate : 'None'}
          icon={Calendar}
          trend={upcomingAppt ? upcomingAppt.appointmentTime : 'Ready to schedule'}
          trendUp={!!upcomingAppt}
        />
        <StatCard
          title="Clinical Consultations"
          value={apptHistory.length}
          icon={FileText}
          trend="Total hospital visits"
          trendUp={true}
        />
        <StatCard
          title="Active Prescriptions"
          value={activePrescriptions.length}
          icon={FlaskConical}
          trend="Current medications"
          trendUp={true}
        />
        <StatCard
          title="Outstanding Balance"
          value={outstandingBills.length > 0 ? `${outstandingBills.length} Bill(s)` : '₹0'}
          icon={Receipt}
          trend={outstandingBills.length === 0 ? 'All bills cleared' : 'Payment pending'}
          trendUp={outstandingBills.length === 0}
        />
      </div>

      {/* Main Grid: Clinical Modules */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Next Consultation & Clinical Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Consultation Spotlight */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 py-3.5 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">Your Next Scheduled Consultation</CardTitle>
                </div>
                {upcomingAppt && <StatusBadge status={upcomingAppt.status} />}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingAppt ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50/70 to-teal-50/40 border border-primary-100">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-xl bg-primary-700 text-white shadow-sm shrink-0">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{upcomingDoctorName || 'Attending Physician'}</h3>
                        <p className="text-xs font-semibold text-primary-700">{upcomingDeptName}</p>
                        <p className="text-xs text-slate-600 mt-1 italic font-medium">"{upcomingAppt.reason || 'General Health Consultation'}"</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        <Clock className="h-3.5 w-3.5 text-primary-600" /> {upcomingAppt.appointmentDate} at {upcomingAppt.appointmentTime}
                      </div>
                      <div className="flex items-center sm:justify-end gap-1 text-2xs text-slate-500 mt-2">
                        <MapPin className="h-3 w-3 text-slate-400" /> Main Medical Center, OPD Wing
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => navigate('/appointments')} className="text-xs font-semibold h-8">
                      View All Appointments
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">No Upcoming Consultations</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    You currently have no visits scheduled. Book an appointment whenever you need expert clinical care.
                  </p>
                  <Button size="sm" onClick={() => navigate('/appointments/new')} className="text-xs font-bold bg-primary-700 hover:bg-primary-800">
                    Book a Consultation Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Health Timeline */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between border-b border-slate-100">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Recent Medical Diagnoses & Care History</CardTitle>
                <CardDescription className="text-xs text-slate-500">Verified electronic records authored by your physicians</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/medical-records')} className="text-xs text-primary-700 font-semibold gap-1">
                Full Records <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {recentRecord ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-3xs font-extrabold text-primary-700 uppercase tracking-wider">Primary Clinical Diagnosis</span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{recentRecord.diagnosis}</h4>
                      <p className="text-2xs text-slate-500 mt-0.5">Recorded on {recentRecord.visitDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">Consultant</span>
                      <p className="text-xs font-bold text-slate-800">
                        {recentRecord.doctorName || (recentRecord.doctor ? `Dr. ${recentRecord.doctor.firstName} ${recentRecord.doctor.lastName}` : 'Physician')}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">Reported Symptoms:</span>
                      <p className="text-slate-600 text-xs leading-relaxed">{recentRecord.symptoms || 'None documented'}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">Prescribed Treatment:</span>
                      <p className="text-slate-600 text-xs leading-relaxed">{recentRecord.treatment || 'Observation & lifestyle advice'}</p>
                    </div>
                  </div>

                  {recentRecord.notes && (
                    <div className="text-xs bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-amber-900">
                      <span className="font-bold">Doctor's Clinical Notes: </span> {recentRecord.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No medical records documented yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Prescriptions & Invoices */}
        <div className="space-y-6">
          {/* Active Medication Regimens */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardHeader className="py-4 px-5 flex flex-row items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <FlaskConical className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Active Prescriptions</CardTitle>
                  <CardDescription className="text-2xs text-slate-500">Current pharmacy orders</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/prescriptions')} className="text-xs text-primary-700 font-semibold">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {activePrescriptions.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Pill className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No active medications prescribed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((presc: any) => (
                    <div key={presc.id || presc.prescriptionId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-slate-900">Order #{presc.id || presc.prescriptionId}</span>
                        <span className="text-3xs text-slate-500 font-medium">{presc.prescriptionDate}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Doctor: {presc.doctorName || (presc.doctor ? `Dr. ${presc.doctor.firstName} ${presc.doctor.lastName}` : 'Physician')}
                      </p>
                      {presc.notes && (
                        <p className="text-2xs text-slate-500 italic mt-1.5 line-clamp-2">"{presc.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing & Settlement Widget */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardHeader className="py-4 px-5 flex flex-row items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Billing Statements</CardTitle>
                  <CardDescription className="text-2xs text-slate-500">Treatment fee statements</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/billing')} className="text-xs text-primary-700 font-semibold">
                Invoices
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {outstandingBills.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                      <AlertCircle className="h-4 w-4 text-amber-700" /> Pending Hospital Invoices
                    </div>
                    <p className="text-2xs text-amber-800">You have {outstandingBills.length} unpaid statement(s) awaiting payment.</p>
                    <Button
                      onClick={() => navigate('/billing')}
                      size="sm"
                      className="w-full mt-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold h-9 shadow-2xs"
                    >
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" /> View & Settle Invoices
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-emerald-900">All Accounts Settled</p>
                  <p className="text-2xs text-emerald-700 mt-0.5">No outstanding payments on your patient account.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
