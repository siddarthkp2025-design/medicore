import React from 'react';
import { Menu, Database, ShieldCheck, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout, isAdmin, isDoctor, isPatient } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Clinical & Operations Dashboard';
    if (path.startsWith('/patients')) return isPatient ? 'My Health Demographics' : 'Patient Electronic Master Index';
    if (path.startsWith('/doctors')) return 'Physician & Specialist Staff';
    if (path.startsWith('/departments')) return 'Hospital Centers & Departments';
    if (path.startsWith('/appointments')) return isPatient ? 'My Consultations' : 'Outpatient Appointments';
    if (path.startsWith('/admissions')) return isPatient ? 'My Inpatient Stays' : 'Inpatient Admissions & Discharges';
    if (path.startsWith('/rooms')) return 'Wards & Room Bed Management';
    if (path.startsWith('/medical-records')) return isPatient ? 'My Medical Records' : 'Electronic Health Records';
    if (path.startsWith('/prescriptions')) return isPatient ? 'My Prescriptions' : 'Pharmacy Orders & Prescriptions';
    if (path.startsWith('/medicines')) return 'Pharmaceutical Formulary';
    if (path.startsWith('/billing')) return isPatient ? 'My Billing Statements' : 'Hospital Billing & Invoices';
    if (path.startsWith('/reports')) return 'Clinical & Financial Telemetry';
    return 'Hospital Management System';
  };

  const roleText = isAdmin ? 'Hospital Administrator' : isDoctor ? 'Attending Physician' : 'Verified Patient';
  const roleColor = isAdmin ? 'text-blue-700 bg-blue-50 border-blue-200' : isDoctor ? 'text-teal-700 bg-teal-50 border-teal-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 shadow-2xs backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-600 hover:bg-slate-100"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">MediCore HMS</span>
            <span className="text-slate-300">•</span>
            <span className="text-2xs font-bold text-primary-700">{getPageTitle()}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Active Workspace: <strong className="text-slate-800">{user?.fullName || 'User'}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live DB Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-2xs font-bold text-slate-600 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="h-3 w-3 text-slate-500" />
          <span>PostgreSQL (Supabase)</span>
        </div>

        {/* Role Pill */}
        <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-bold border ${roleColor}`}>
          {roleText}
        </span>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary-100 hover:ring-primary-200 transition-all p-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-tr from-primary-700 to-teal-600 font-bold text-white text-xs">
                  {user?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 p-2 shadow-lg rounded-xl border border-slate-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2 bg-slate-50 rounded-lg mb-1">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.fullName}</p>
                <p className="text-2xs text-slate-500">
                  ID: {user?.username}
                </p>
                <span className="text-3xs font-semibold text-primary-700 uppercase tracking-wider mt-1">
                  {roleText}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-rose-600 focus:bg-rose-50 text-xs font-semibold cursor-pointer rounded-lg p-2">
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out from System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
