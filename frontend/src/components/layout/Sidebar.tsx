import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  BedDouble,
  DoorOpen,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavSection {
  title?: string;
  items: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const { user, isAdmin, isDoctor, isPatient, logout } = useAuth();
  const location = useLocation();

  const adminSections: NavSection[] = [
    {
      title: 'Clinical Operations',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Physicians', href: '/doctors', icon: Stethoscope },
      ]
    },
    {
      title: 'Hospital Services',
      items: [
        { name: 'Admissions', href: '/admissions', icon: BedDouble },
        { name: 'Inpatient Rooms', href: '/rooms', icon: DoorOpen },
        { name: 'Departments', href: '/departments', icon: Building2 },
      ]
    },
    {
      title: 'Pharmacy & Health',
      items: [
        { name: 'Medical Records', href: '/medical-records', icon: FileText },
        { name: 'Prescriptions', href: '/prescriptions', icon: FlaskConical },
        { name: 'Drug Formulary', href: '/medicines', icon: Pill },
      ]
    },
    {
      title: 'Finance & Telemetry',
      items: [
        { name: 'Billing & Invoices', href: '/billing', icon: Receipt },
        { name: 'Analytics & Reports', href: '/reports', icon: BarChart3 },
      ]
    }
  ];

  const doctorSections: NavSection[] = [
    {
      title: 'Clinical Practice',
      items: [
        { name: 'Doctor Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Consultations', href: '/appointments', icon: Calendar },
        { name: 'Assigned Patients', href: '/patients', icon: Users },
        { name: 'Medical Records', href: '/medical-records', icon: FileText },
        { name: 'Prescriptions', href: '/prescriptions', icon: FlaskConical },
      ]
    }
  ];

  const patientSections: NavSection[] = [
    {
      title: 'Patient Portal',
      items: [
        { name: 'Health Portal', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
        { name: 'My Medical Records', href: '/medical-records', icon: FileText },
        { name: 'Active Prescriptions', href: '/prescriptions', icon: FlaskConical },
        { name: 'My Bills & Receipts', href: '/billing', icon: Receipt },
      ]
    }
  ];

  const sections = isAdmin ? adminSections : isDoctor ? doctorSections : isPatient ? patientSections : [];

  const roleLabel = isAdmin ? 'Admin' : isDoctor ? 'Physician' : 'Patient';
  const roleBadgeColor = isAdmin ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : isDoctor ? 'bg-teal-500/20 text-teal-300 border-teal-400/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 text-slate-100 transition-all duration-300 md:relative select-none border-r border-slate-900",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-900 bg-slate-950/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-primary-900/40">
              <Activity className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white">MediCore</span>
                <span className="text-3xs text-teal-400 uppercase tracking-widest font-bold">Hospital System</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && section.title && (
                <div className="px-3 pb-1 text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname.startsWith(item.href) &&
                  (item.href !== '/dashboard' || location.pathname === '/dashboard');

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-xl px-3 py-2 text-xs font-semibold transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-primary-700/80 to-teal-700/80 text-white shadow-sm shadow-primary-950/40"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-teal-400" />
                    )}
                    <item.icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-teal-300" : "text-slate-500 group-hover:text-slate-300",
                        collapsed ? "mx-auto h-5 w-5" : "mr-3 h-4 w-4"
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-900 p-3 bg-slate-950/60">
          <div className={cn("flex items-center rounded-xl p-2 bg-slate-900/60 border border-slate-800/60", collapsed ? "justify-center" : "gap-2.5")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-700 font-bold text-white text-xs shadow-inner">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-100 truncate">{user?.fullName || 'User'}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block text-3xs font-semibold px-1.5 py-0.2 rounded border ${roleBadgeColor}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-2 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs font-semibold transition-colors",
              collapsed ? "px-0 justify-center" : "justify-start"
            )}
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2 text-slate-400")} />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
