import React, { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  Users,
  Database,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Heart,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sign In Validation Schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration Validation Schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'Max 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Max 50 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(100),
  phone: z.string().min(7, 'Phone must be at least 7 digits').max(20, 'Max 20 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select gender' }),
  bloodGroup: z.string().optional(),
  address: z.string().max(500, 'Max 500 characters').optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Only letters, numbers, dots, underscores, and dashes allowed'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<'admin' | 'doctor' | 'patient' | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useReactHookForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Registration Form
  const {
    register: registerPatient,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegisterForm,
    formState: { errors: regErrors, isSubmitting: isRegistering },
  } = useReactHookForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: 'Male',
      bloodGroup: 'O+',
    }
  });

  // Demo account selection (Pre-fills without auto-submitting)
  const handleSelectDemoRole = (role: 'admin' | 'doctor' | 'patient') => {
    setSelectedDemoRole(role);
    if (role === 'admin') {
      setLoginValue('username', 'demo.admin');
      setLoginValue('password', 'Demo@123');
    } else if (role === 'doctor') {
      setLoginValue('username', 'demo.doctor');
      setLoginValue('password', 'Demo@123');
    } else if (role === 'patient') {
      setLoginValue('username', 'demo.patient');
      setLoginValue('password', 'Demo@123');
    }
  };

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response);
      toast({
        title: 'Authentication Successful',
        description: `Welcome back, ${response.fullName}!`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid username or password. Please check your credentials.';
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const res = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        username: data.username,
        password: data.password,
      });

      toast({
        title: 'Patient Account Created!',
        description: `Your account '${data.username}' has been successfully created. Please sign in.`,
      });

      // Reset and switch to login tab with the new username prefilled
      resetRegisterForm();
      setActiveTab('login');
      setLoginValue('username', data.username);
      setLoginValue('password', '');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Please check your input and try again.';
      toast({
        variant: 'destructive',
        title: 'Registration Error',
        description: msg,
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 font-sans antialiased text-slate-100">
      
      {/* Left Column: Clinical SaaS Showcase & Telemetry Brand */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-slate-800/60">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary-600 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                MediCore <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary-900/60 text-primary-300 border border-primary-500/30">HMS</span>
              </span>
              <p className="text-2xs text-slate-400 font-medium tracking-wide">Enterprise Healthcare SaaS</p>
            </div>
          </div>
        </div>

        {/* Center Presentation: Cardiac Waveform & Value Proposition */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-teal-400 text-xs font-semibold mb-6 shadow-xs backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            Cloud Database Driven • Real Clinical Telemetry
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Precision Healthcare <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-teal-300 to-blue-200">
              Information System
            </span>
          </h1>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-lg">
            A unified clinical operating platform connecting patients, physicians, inpatient wards, and pharmacy workflows with strict healthcare data confidentiality.
          </p>

          {/* SVG Animated Cardiac ECG Waveform */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between text-2xs text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Activity className="h-3.5 w-3.5" /> LIVE TELEMETRY STREAM
              </span>
              <span>SUPABASE POSTGRESQL • CONNECTED</span>
            </div>
            <svg viewBox="0 0 500 70" className="w-full h-14 stroke-teal-400 fill-none stroke-[2] opacity-90 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]">
              <path d="M 0 35 L 60 35 L 75 35 L 85 10 L 95 60 L 105 25 L 115 42 L 125 35 L 200 35 L 215 35 L 225 8 L 235 62 L 245 22 L 255 45 L 265 35 L 340 35 L 355 35 L 365 12 L 375 58 L 385 24 L 395 44 L 405 35 L 500 35" />
            </svg>
          </div>

          {/* Value Prop Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="text-primary-400 font-bold text-sm">Strict Isolation</div>
              <div className="text-2xs text-slate-400 mt-0.5">Patient privacy enforced via token security</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="text-teal-400 font-bold text-sm">Full EHR Lifecycle</div>
              <div className="text-2xs text-slate-400 mt-0.5">Consultations, Rx orders, and GST bills</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="text-blue-400 font-bold text-sm">Cloud Ready</div>
              <div className="text-2xs text-slate-400 mt-0.5">Prepared for Supabase & Railway</div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-2xs text-slate-500 border-t border-slate-900 pt-4">
          <span>MediCore Clinical System • ISO 27001 & HIPAA Compliant Architecture</span>
          <span className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5 text-slate-400" /> PostgreSQL Cloud Engine
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Card (Sign In & Create Account) */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 bg-slate-900/50 backdrop-blur-xl">
        <div className="w-full max-w-md space-y-6">

          {/* Card Header & Tab Switcher */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 w-full shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" /> Create Account
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {activeTab === 'login' ? 'Hospital Portal Login' : 'Patient Self-Registration'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'login'
                  ? 'Access your clinical records, duty schedule, or administrative command console.'
                  : 'Register for a personal healthcare account with persistent cloud records.'}
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: SIGN IN VIEW */}
          {/* ============================================================ */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Quick Demo Access Bar (Exactly 3 demo accounts) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-primary-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> 1-Click Demo Profiles
                  </span>
                  <span className="text-slate-500 font-mono">Password: Demo@123</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoRole('admin')}
                    className={`px-2.5 py-1.5 rounded-lg text-2xs font-bold transition-all border text-center ${
                      selectedDemoRole === 'admin'
                        ? 'bg-primary-600/30 text-primary-300 border-primary-500 shadow-2xs'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoRole('doctor')}
                    className={`px-2.5 py-1.5 rounded-lg text-2xs font-bold transition-all border text-center ${
                      selectedDemoRole === 'doctor'
                        ? 'bg-teal-600/30 text-teal-300 border-teal-500 shadow-2xs'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoRole('patient')}
                    className={`px-2.5 py-1.5 rounded-lg text-2xs font-bold transition-all border text-center ${
                      selectedDemoRole === 'patient'
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-2xs'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Patient
                  </button>
                </div>
                <p className="text-3xs text-slate-500 text-center">
                  Clicking pre-fills credentials without auto-submitting.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary-400" /> Username / Healthcare ID
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username (e.g. demo.patient)"
                    {...registerLogin('username')}
                    className="h-10 bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary-500 text-xs"
                  />
                  {loginErrors.username && (
                    <p className="text-2xs text-rose-400 font-medium">{loginErrors.username.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary-400" /> Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...registerLogin('password')}
                      className="h-10 bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary-500 pr-10 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-2xs text-rose-400 font-medium">{loginErrors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold text-xs shadow-md shadow-primary-900/30 transition-all rounded-lg mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In to Healthcare Portal <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Bottom Switcher */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs text-slate-400 hover:text-teal-400 transition-colors font-medium"
                >
                  New patient? <span className="text-teal-400 font-bold underline underline-offset-4">Create Patient Account</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: CREATE ACCOUNT VIEW */}
          {/* ============================================================ */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-900/50 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <p className="text-2xs text-teal-300/90 leading-relaxed">
                  Public self-registration automatically creates a verified <strong className="text-white">PATIENT</strong> profile in the database. (Administrative and Doctor staff accounts are provisioned internally).
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {/* Names */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-2xs font-semibold text-slate-300">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="e.g. Rohit"
                      {...registerPatient('firstName')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.firstName && <p className="text-3xs text-rose-400">{regErrors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-2xs font-semibold text-slate-300">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="e.g. Verma"
                      {...registerPatient('lastName')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.lastName && <p className="text-3xs text-rose-400">{regErrors.lastName.message}</p>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-2xs font-semibold text-slate-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rohit@example.com"
                      {...registerPatient('email')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.email && <p className="text-3xs text-rose-400">{regErrors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-2xs font-semibold text-slate-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      {...registerPatient('phone')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.phone && <p className="text-3xs text-rose-400">{regErrors.phone.message}</p>}
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="dateOfBirth" className="text-2xs font-semibold text-slate-300">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...registerPatient('dateOfBirth')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.dateOfBirth && <p className="text-3xs text-rose-400">{regErrors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gender" className="text-2xs font-semibold text-slate-300">Gender *</Label>
                    <select
                      id="gender"
                      {...registerPatient('gender')}
                      className="w-full h-9 px-3 rounded-md bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {regErrors.gender && <p className="text-3xs text-rose-400">{regErrors.gender.message}</p>}
                  </div>
                </div>

                {/* Blood Group & Address */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="bloodGroup" className="text-2xs font-semibold text-slate-300">Blood Group</Label>
                    <select
                      id="bloodGroup"
                      {...registerPatient('bloodGroup')}
                      className="w-full h-9 px-3 rounded-md bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address" className="text-2xs font-semibold text-slate-300">City / Address</Label>
                    <Input
                      id="address"
                      placeholder="e.g. Bangalore"
                      {...registerPatient('address')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="emergencyContactName" className="text-2xs font-semibold text-slate-300">Emergency Contact</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Relative / Guardian"
                      {...registerPatient('emergencyContactName')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="emergencyContactPhone" className="text-2xs font-semibold text-slate-300">Emergency Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      placeholder="9876543211"
                      {...registerPatient('emergencyContactPhone')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <Label htmlFor="regUsername" className="text-2xs font-semibold text-slate-300">Desired Username *</Label>
                  <Input
                    id="regUsername"
                    placeholder="e.g. rohit.verma"
                    {...registerPatient('username')}
                    className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                  />
                  {regErrors.username && <p className="text-3xs text-rose-400">{regErrors.username.message}</p>}
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="regPassword" className="text-2xs font-semibold text-slate-300">Password *</Label>
                    <div className="relative">
                      <Input
                        id="regPassword"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...registerPatient('password')}
                        className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showRegisterPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {regErrors.password && <p className="text-3xs text-rose-400">{regErrors.password.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-2xs font-semibold text-slate-300">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerPatient('confirmPassword')}
                      className="h-9 bg-slate-950/80 border-slate-800 text-xs text-white"
                    />
                    {regErrors.confirmPassword && <p className="text-3xs text-rose-400">{regErrors.confirmPassword.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full h-10 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-teal-900/30 rounded-lg mt-3"
                >
                  {isRegistering ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Creating Patient Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Complete Registration <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Back to sign in */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-slate-400 hover:text-white transition-colors font-medium"
                >
                  Already have an account? <span className="text-primary-400 font-bold underline underline-offset-4">Sign In here</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Guarantee Pill */}
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-3xs text-slate-500 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              Secure 256-Bit Encrypted Healthcare Session
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
