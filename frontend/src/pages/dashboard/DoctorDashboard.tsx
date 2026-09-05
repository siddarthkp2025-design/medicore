import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  FileText,
  FlaskConical,
  Clock,
  ChevronRight,
  Stethoscope,
  Plus,
  ArrowUpRight,
  ClipboardList,
  Activity,
  HeartPulse
} from 'lucide-react';
import { reportService } from '@/services/report.service';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function DoctorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctorStats = async () => {
      try {
        const data = await reportService.getDoctorDashboard();
        setStats(data);
      } catch (error) {
        console.error('Error fetching doctor dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctorStats();
  }, []);

  if (isLoading) return <LoadingSkeleton rows={10} />;

  const todayAppts = stats?.todayAppointmentsList || stats?.recentAppointments || [];
  const recentRecords = stats?.recentMedicalRecords || [];

  return (
    <div className="space-y-6">
      {/* Clinical Workspace Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-primary-950 p-7 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-2xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Stethoscope className="h-3.5 w-3.5 text-teal-400" />
              <span>Attending Physician • Clinical Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user?.fullName || 'Doctor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time outpatient consultation schedule, electronic clinical charting, and pharmacy prescription orders powered by Cloud PostgreSQL Database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => navigate('/medical-records/new')}
              className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs h-10 px-4 shadow-sm transition-all"
            >
              <Plus className="mr-1.5 h-4 w-4" /> New Clinical Note
            </Button>
            <Button
              onClick={() => navigate('/prescriptions/new')}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold text-xs h-10 px-4 backdrop-blur-xs"
            >
              <FlaskConical className="mr-1.5 h-4 w-4 text-teal-300" /> Write Rx
            </Button>
          </div>
        </div>
      </div>

      {/* Clinical Telemetry KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Outpatients"
          value={stats?.todayAppointments ?? todayAppts.length}
          icon={Calendar}
          trend="Consultations scheduled"
          trendUp={true}
        />
        <StatCard
          title="Total Assigned Patients"
          value={stats?.totalPatients ?? 0}
          icon={Users}
          trend="Registered under care"
          trendUp={true}
        />
        <StatCard
          title="Clinical Records"
          value={stats?.totalMedicalRecords ?? 0}
          icon={FileText}
          trend="Diagnoses documented"
          trendUp={true}
        />
        <StatCard
          title="Active Prescriptions"
          value={stats?.totalPrescriptions ?? 0}
          icon={FlaskConical}
          trend="Pharmacy orders active"
          trendUp={true}
        />
      </div>

      {/* Main Clinical Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Outpatient Consultation Schedule (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Today's Patient Schedule & Queue</CardTitle>
                <CardDescription className="text-xs text-slate-500">Outpatient clinical appointments for review</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')} className="text-xs text-primary-700 font-semibold gap-1">
                View Schedule <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {todayAppts.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-slate-700">No appointments scheduled for today</p>
                  <p className="text-xs text-slate-500 mt-1">Check upcoming dates or review your patient roster.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppts.map((appt: any) => {
                    const pName = appt.patientName || (appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Patient');
                    const bGroup = appt.patient?.bloodGroup;
                    return (
                      <div
                        key={appt.id || appt.appointmentId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all gap-3"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0 font-bold text-xs">
                            {appt.appointmentTime || 'OPD'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900">{pName}</h4>
                              {bGroup && (
                                <span className="text-3xs font-bold px-1.5 py-0.2 rounded bg-primary-50 text-primary-800 border border-primary-100">
                                  {bGroup}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 italic font-medium">"{appt.reason || 'General Consultation'}"</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                          <StatusBadge status={appt.status} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/appointments/${appt.id || appt.appointmentId}`)}
                            className="text-xs font-semibold h-7 px-2.5 border-slate-200 hover:bg-white"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Diagnoses Authored */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between border-b border-slate-100">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Recent Diagnoses & Treatments Authored</CardTitle>
                <CardDescription className="text-xs text-slate-500">Electronic health documentation recorded by you</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/medical-records')} className="text-xs text-primary-700 font-semibold">
                All Records
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {recentRecords.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No recent medical records authored.</p>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map((rec: any) => {
                    const pName = rec.patientName || (rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : 'Patient');
                    return (
                      <div key={rec.id || rec.recordId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{pName}</span>
                          <span className="text-3xs text-slate-400">{rec.visitDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {rec.diagnosis}
                          </span>
                          <span className="text-2xs text-slate-600 line-clamp-1 truncate">{rec.treatment}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Clinical Actions & Department Roster */}
        <div className="space-y-6">
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardHeader className="py-4 px-5 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Clinical Quick Actions</CardTitle>
              <CardDescription className="text-2xs text-slate-500">Fast medical documentation shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-bold text-slate-700 hover:bg-slate-50 h-10 border-slate-200"
                onClick={() => navigate('/medical-records/new')}
              >
                <ClipboardList className="mr-2 h-4 w-4 text-primary-600" /> Document Clinical Note
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-bold text-slate-700 hover:bg-slate-50 h-10 border-slate-200"
                onClick={() => navigate('/prescriptions/new')}
              >
                <FlaskConical className="mr-2 h-4 w-4 text-teal-600" /> Write Pharmacy Prescription
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-bold text-slate-700 hover:bg-slate-50 h-10 border-slate-200"
                onClick={() => navigate('/patients')}
              >
                <Users className="mr-2 h-4 w-4 text-emerald-600" /> Search Patient Demographics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-bold text-slate-700 hover:bg-slate-50 h-10 border-slate-200"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="mr-2 h-4 w-4 text-purple-600" /> View Consultation Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Departmental Roster Card */}
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Hospital Duty Protocol</h4>
                <p className="text-2xs text-slate-500">Connected to Inpatient Ward Emergency System</p>
              </div>
            </div>
            <p className="text-2xs text-slate-600 leading-relaxed">
              All clinical records and pharmacy orders entered in this portal are committed in real-time to PostgreSQL Cloud Database with row-level transaction security.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
