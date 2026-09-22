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
  Search,
  Smartphone,
  Building,
  Banknote
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function BillList() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Payment Settlement Modal State
  const [payingBill, setPayingBill] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleProcessPayment = async () => {
    if (!payingBill) return;
    setIsProcessing(true);
    const bId = payingBill.id || payingBill.billId;
    try {
      await billService.updatePayment(Number(bId), { paymentStatus: 'Paid', paymentMethod });
      toast({
        title: 'Payment Successful',
        description: `Invoice INV-${bId} has been settled via ${paymentMethod}. Official receipt generated.`
      });
      setPayingBill(null);
      fetchBills();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Payment transaction could not be processed.';
      toast({ variant: 'destructive', title: 'Payment Failed', description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

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
      header: 'Payment Mode',
      accessor: (b: any) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {b.paymentMethod || 'Unsettled'}
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
        const isUnpaid = b.paymentStatus?.toUpperCase() !== 'PAID';
        return (
          <div className="flex items-center gap-1.5">
            {isUnpaid && (
              <Button
                size="sm"
                onClick={() => {
                  setPayingBill(b);
                  setPaymentMethod('UPI');
                }}
                className="text-2xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs"
              >
                <CreditCard className="h-3 w-3 mr-1" /> Pay Now
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/billing/${id}`)}
              className="text-2xs h-7 px-2 text-primary-700 hover:bg-primary-50 border-slate-200"
            >
              <Printer className="h-3 w-3 mr-1" /> View / Print
            </Button>
          </div>
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
          <p className="text-2xs text-emerald-600 font-semibold mt-2">Hospital Revenue Settled</p>
        </Card>

        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isPatient ? 'Outstanding Due' : 'Unpaid Hospital Balance'}
              </p>
              <p className={`text-2xl font-black mt-1 ${balanceDue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                ₹{balanceDue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${balanceDue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xs text-slate-400 mt-2">
            {balanceDue > 0 ? 'Action required: payment pending' : 'All accounts settled'}
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

      {/* Payment Settlement Modal */}
      {payingBill && (
        <Dialog open={!!payingBill} onOpenChange={(open) => !open && setPayingBill(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Complete Invoice Payment
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Settle outstanding clinical encounter and treatment charges for Statement #{payingBill.id || payingBill.billId}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Invoice Summary Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Patient:</span>
                  <span className="font-bold text-slate-900">
                    {payingBill.patientName || (payingBill.patient ? `${payingBill.patient.firstName} ${payingBill.patient.lastName}` : 'Patient')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Billing Date:</span>
                  <span className="font-semibold text-slate-800">{payingBill.billingDate}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-emerald-700">₹{Number(payingBill.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Select Settlement Method</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mb-1 text-emerald-600" />
                    <span className="text-xs font-bold">UPI / QR</span>
                    <span className="text-3xs text-slate-500 mt-0.5">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mb-1 text-blue-600" />
                    <span className="text-xs font-bold">Debit / Credit Card</span>
                    <span className="text-3xs text-slate-500 mt-0.5">Visa, Master, RuPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Net Banking')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Net Banking'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building className="h-5 w-5 mb-1 text-indigo-600" />
                    <span className="text-xs font-bold">Net Banking</span>
                    <span className="text-3xs text-slate-500 mt-0.5">SBI, HDFC, ICICI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Cash'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Banknote className="h-5 w-5 mb-1 text-amber-600" />
                    <span className="text-xs font-bold">Hospital Counter</span>
                    <span className="text-3xs text-slate-500 mt-0.5">Cash / POS Receipt</span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPayingBill(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                {isProcessing ? 'Processing Transaction...' : `Confirm & Pay ₹${Number(payingBill.totalAmount).toLocaleString('en-IN')}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
