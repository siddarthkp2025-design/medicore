import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { reportService } from '@/services/report.service';
import { AdminDashboardStats } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#1e40af', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const mockStats: AdminDashboardStats = {
          totalPatients: 1248,
          totalDoctors: 45,
          todayAppointments: 32,
          availableRooms: 12,
          pendingBills: 18,
          monthlyRevenue: 452000,
          appointmentTrends: [
            { name: 'Jan', total: 120 }, { name: 'Feb', total: 150 },
            { name: 'Mar', total: 180 }, { name: 'Apr', total: 210 },
            { name: 'May', total: 190 }, { name: 'Jun', total: 240 }
          ],
          revenueTrends: [
            { name: 'Jan', total: 320000 }, { name: 'Feb', total: 350000 },
            { name: 'Mar', total: 380000 }, { name: 'Apr', total: 410000 },
            { name: 'May', total: 390000 }, { name: 'Jun', total: 452000 }
          ],
          departmentStats: [
            { name: 'Cardiology', value: 35 }, { name: 'Orthopedics', value: 25 },
            { name: 'Pediatrics', value: 20 }, { name: 'Neurology', value: 15 },
            { name: 'General', value: 45 }
          ],
          recentAppointments: [],
          recentPatients: []
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching reports data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) return <LoadingSkeleton rows={15} />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports & Analytics" 
        description="Comprehensive hospital metrics and data visualization." 
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-md mb-6 inline-flex overflow-x-auto w-full md:w-auto h-auto whitespace-nowrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.revenueTrends}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip formatter={(value) => `₹${value}`} />
                      <Area type="monotone" dataKey="total" stroke="#1e40af" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appointmentTrends}>
                      <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip />
                      <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Month</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.appointmentTrends}>
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueTrends}>
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <RechartsTooltip formatter={(value) => `₹${value}`} />
                    <Bar dataKey="total" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Department Case Load Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.departmentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
