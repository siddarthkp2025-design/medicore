import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Plus,
  Receipt,
  IndianRupee,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  AlertCircle,
  FileText,
  Search
} from 'lucide-react';
import { billService } from '@/services/bill.service';
import { Bill } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function BillList() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { isAdmin, isPatient } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const res = await billService.getAll();
      setBills(res?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch billing statements from server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((b: any) => {
    if (statusFilter !== 'ALL' && b.paymentStatus?.toUpperCase() !== statusFilter) {
      return false;
    }
    if (!isPatient && searchTerm) {
      const patientName = b.patientName || (b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : '');
      const billId = String(b.id || b.billId || '');
      const term = searchTerm.toLowerCase();
      if (!patientName.toLowerCase().includes(term) && !billId.includes(term)) {
        return false;
      }
    }
    return true;
  });

  // Calculate Financial Summary
  const totalBilled = filteredBills.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);
  const totalPaid = filteredBills
    .filter(b => b.paymentStatus?.toUpperCase() === 'PAID')
    .reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);
  const balanceDue = totalBilled - totalPaid;

  const columns = [
    {
      header: 'Invoice #',
      accessor: (b: any) => <span className="font-bold text-slate-900">INV-{b.id || b.billId}</span>
    },
    ...(!isPatient ? [{
      header: 'Patient Name',
      accessor: (b: any) => {
        const pName = b.patientName || (b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : 'Patient');
        return <span className="font-semibold text-slate-900">{pName}</span>;
      }
    }] : []),
    {
      header: 'Billing Date',
      accessor: (b: any) => <span className="text-xs text-slate-600 font-medium">{b.billingDate}</span>
    },
    {
      header: 'Charge Breakdown',
      accessor: (b: any) => (
        <div className="text-2xs text-slate-500 space-y-0.5">
          {Number(b.consultationCharge) > 0 && <span>Consult: ₹{b.consultationCharge} </span>}
          {Number(b.roomCharge) > 0 && <span>• Bed: ₹{b.roomCharge} </span>}
          {Number(b.medicineCharge) > 0 && <span>• Rx: ₹{b.medicineCharge}</span>}
        </div>
      )
    },
    {
      header: 'Total Amount',
      accessor: (b: any) => (
        <span className="font-black text-slate-900 text-sm">
          ₹{Number(b.totalAmount).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Payment Method',
      accessor: (b: any) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {b.paymentMethod || 'Hospital Desk'}
        </span>
      )
    },
    {
      header: 'Settlement Status',
      accessor: (b: any) => <StatusBadge status={b.paymentStatus} />
    },
    {
      header: 'Actions',
      accessor: (b: any) => {
        const id = b.id || b.billId;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/billing/${id}`)}
            className="text-2xs h-7 px-2.5 text-primary-700 hover:bg-primary-50 border-slate-200"
          >
            <Printer className="h-3.5 w-3.5 mr-1" /> View / Print
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPatient ? 'My Billing Statements' : 'Hospital Billing & Invoices'}
        description={
          isPatient
            ? 'Personal financial statements for your clinical consultations, treatments, room tariffs, and medications.'
            : 'Hospital-wide billing master index, GST invoices, insurance claims, and revenue settlement status.'
        }
        action={
          isAdmin && (
            <Button onClick={() => navigate('/billing/new')} className="bg-primary-700 hover:bg-primary-800 text-xs font-bold shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Generate New Bill
            </Button>
          )
        }
      />

      {/* Financial Health Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isPatient ? 'Total Billed Amount' : 'Gross Billed Revenue'}
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{totalBilled.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xs text-slate-400 mt-2">{filteredBills.length} statement(s) issued</p>
        </Card>

        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Paid & Cleared</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xs text-slate-400 mt-2">Fully settled invoices</p>
        </Card>

        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance Due / Outstanding</p>
              <p className={`text-2xl font-black mt-1 ${balanceDue > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                ₹{balanceDue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${balanceDue > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'}`}>
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xs text-slate-400 mt-2">
            {balanceDue > 0 ? 'Payment required' : 'All accounts settled'}
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PAID', 'PENDING', 'PARTIAL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-2xs font-bold tracking-wider uppercase transition-all ${
                statusFilter === st
                  ? 'bg-primary-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Statements' : st}
            </button>
          ))}
        </div>

        {!isPatient && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search by patient name or invoice #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs border-slate-200 bg-slate-50 focus-visible:bg-white"
            />
          </div>
        )}
      </div>

      <DataTable
        data={filteredBills}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder=""
        emptyMessage={isPatient ? 'No billing statements found.' : 'No invoices matching filters.'}
      />
    </div>
  );
}
