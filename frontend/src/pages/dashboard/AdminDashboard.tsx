import React, { useState, useEffect } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  DoorOpen,
  Receipt,
  IndianRupee,
  Activity,
  TrendingUp,
  Building2,
  BedDouble,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { reportService } from '@/services/report.service';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const COLORS = ['#1d4ed8', '#0d9488', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reportService.getAdminDashboard();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton rows={10} />;
  }

  const revenueTrends = stats?.revenueTrends || [];
  const departmentStats = stats?.departmentStats || [];
  const recentAppointments = stats?.recentAppointments || [];
  const recentPatients = stats?.recentPatients || [];

  return (
    <div className="space-y-6">
      {/* Operations Command Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-primary-950 to-teal-950 p-7 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-2xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Activity className="h-3.5 w-3.5 text-teal-400" />
              <span>Hospital Operations & Clinical Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              MediCore Operations Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidated hospital administration overview: active clinical volumes, inpatient bed allocations, and revenue streams executing against Supabase Cloud PostgreSQL.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => navigate('/admissions/new')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-10 px-4 shadow-sm transition-all"
            >
              <BedDouble className="mr-1.5 h-4 w-4" /> Inpatient Admission
            </Button>
            <Button
              onClick={() => navigate('/reports')}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold text-xs h-10 px-4 backdrop-blur-xs"
            >
              <TrendingUp className="mr-1.5 h-4 w-4 text-teal-300" /> Financial Reports
            </Button>
          </div>
        </div>
      </div>

      {/* High-Density Hospital KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients ?? 0}
          icon={Users}
          trend="+12% this month"
          trendUp={true}
        />
        <StatCard
          title="Doctors On Staff"
          value={stats?.totalDoctors ?? 0}
          icon={Stethoscope}
          trend="9 active specialties"
          trendUp={true}
        />
        <StatCard
          title="Today's Appts"
          value={stats?.todayAppointments ?? 0}
          icon={Calendar}
          trend="Outpatient schedule"
          trendUp={true}
        />
        <StatCard
          title="Available Beds"
          value={stats?.availableRooms ?? 0}
          icon={DoorOpen}
          trend="Ready for admission"
          trendUp={true}
        />
        <StatCard
          title="Pending Bills"
          value={stats?.pendingBills ?? 0}
          icon={Receipt}
          trend="Awaiting clearance"
          trendUp={false}
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={IndianRupee}
          trend="Current month"
          trendUp={true}
        />
      </div>

      {/* Visual Telemetry Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Performance Area Chart (2 Cols) */}
        <Card className="lg:col-span-2 border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Hospital Billing & Revenue Performance</CardTitle>
              <CardDescription className="text-xs text-slate-500">Monthly gross billing collections across inpatient & outpatient care</CardDescription>
            </div>
            <span className="text-3xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Live Cloud Data
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72 w-full">
              {revenueTrends.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Insufficient monthly billing records
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Gross Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1d4ed8"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departmental Physician Distribution */}
        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
          <CardHeader className="py-4 px-5 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900">Clinical Department Roster</CardTitle>
            <CardDescription className="text-2xs text-slate-500">Distribution of specialist faculty by discipline</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-48 w-full">
              {departmentStats.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No department statistics
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {departmentStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {departmentStats.slice(0, 5).map((dept: any, index: number) => (
                <div key={dept.name} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium text-slate-700 truncate max-w-[130px]">{dept.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{dept.count} Drs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Streams: Recent Appointments & Patients */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Appointments Stream */}
        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Recent Outpatient Appointments</CardTitle>
              <CardDescription className="text-xs text-slate-500">Live scheduling intake</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')} className="text-xs text-primary-700 font-semibold gap-1">
              All Visits <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentAppointments.slice(0, 5).map((appt: any) => {
                const pName = appt.patientName || (appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Patient');
                const dName = appt.doctorName || (appt.doctor ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}` : 'Doctor');
                return (
                  <div key={appt.id || appt.appointmentId} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{pName}</span>
                      <span className="text-2xs text-slate-500">{dName} • {appt.appointmentDate} at {appt.appointmentTime}</span>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patient Master Index */}
        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Recently Enrolled Patients</CardTitle>
              <CardDescription className="text-xs text-slate-500">Master patient index enrollments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')} className="text-xs text-primary-700 font-semibold gap-1">
              Directory <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentPatients.slice(0, 5).map((p: any) => (
                <div key={p.id || p.patientId} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{p.firstName} {p.lastName}</span>
                      <span className="text-2xs text-slate-500">{p.phone} • {p.gender}</span>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-800 border border-primary-100">
                    {p.bloodGroup || 'Blood Group N/A'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
