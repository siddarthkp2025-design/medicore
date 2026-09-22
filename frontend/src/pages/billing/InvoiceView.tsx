import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building,
  Banknote
} from 'lucide-react';
import { billService } from '@/services/bill.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bill, setBill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBill = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await billService.getById(Number(id));
      setBill(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Access Denied: You cannot view this invoice.';
      setError(msg);
      toast({ variant: 'destructive', title: 'Invoice Access Error', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBill();
  }, [id]);

  const handleProcessPayment = async () => {
    if (!bill) return;
    setIsProcessing(true);
    const bId = bill.id || bill.billId;
    try {
      await billService.updatePayment(Number(bId), { paymentStatus: 'Paid', paymentMethod });
      toast({
        title: 'Payment Successful',
        description: `Statement #${bId} has been successfully settled via ${paymentMethod}.`
      });
      setShowPaymentModal(false);
      fetchBill();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Payment transaction failed.';
      toast({ variant: 'destructive', title: 'Payment Failed', description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={15} />;

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white border border-red-200 rounded-xl text-center shadow-sm">
        <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600 mt-1 mb-5 leading-relaxed">{error}</p>
        <Button onClick={() => navigate('/billing')} variant="outline" size="sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Statements
        </Button>
      </div>
    );
  }

  if (!bill) return null;

  const patientName = bill.patientName || (bill.patient ? `${bill.patient.firstName} ${bill.patient.lastName}` : 'Patient');
  const patientId = bill.patientId || bill.patient?.id || '-';
  const consultCharge = Number(bill.consultationCharge) || 0;
  const roomCharge = Number(bill.roomCharge) || 0;
  const medCharge = Number(bill.medicineCharge) || 0;
  const otherCharge = Number(bill.otherCharges) || 0;
  const discount = Number(bill.discount) || 0;
  const tax = Number(bill.tax) || 0;
  const totalAmount = Number(bill.totalAmount) || (consultCharge + roomCharge + medCharge + otherCharge - discount + tax);
  const subtotal = consultCharge + roomCharge + medCharge + otherCharge;
  const isPaid = bill.paymentStatus?.toUpperCase() === 'PAID';

  return (
    <div className="max-w-4xl mx-auto mb-12">
      {/* Navigation & Action Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 print:hidden">
        <Button variant="outline" size="sm" onClick={() => navigate('/billing')} className="text-xs">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Invoices
        </Button>

        <div className="flex items-center gap-2">
          {!isPaid && (
            <Button
              onClick={() => {
                setPaymentMethod('UPI');
                setShowPaymentModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
            >
              <CreditCard className="mr-2 h-4 w-4" /> Pay Online / Settle (₹{totalAmount.toLocaleString('en-IN')})
            </Button>
          )}

          <Button onClick={() => window.print()} variant="outline" size="sm" className="text-xs font-semibold">
            <Printer className="mr-2 h-3.5 w-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Invoice Document Body */}
      <div className="bg-white p-8 sm:p-12 border border-slate-200 shadow-sm rounded-xl print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md mb-2">
              Official Tax Statement
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">INVOICE</h1>
            <p className="text-slate-500 text-sm font-semibold tracking-wide mt-0.5">
              Statement #{String(bill.id || bill.billId).padStart(6, '0')}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-primary-700 tracking-tight">MediCore HMS</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Multi-Specialty Healthcare System</p>
            <p className="text-xs text-slate-500">Connaught Place Medical Enclave, New Delhi</p>
            <p className="text-xs text-slate-500">Emergency & OPD: +91 11 2345 0100</p>
          </div>
        </div>

        {/* Bill To & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mb-1">Patient Details</p>
            <p className="font-bold text-base text-slate-900">{patientName}</p>
            <p className="text-xs text-slate-600 mt-0.5">Medical ID: MED-{patientId}</p>
            {bill.patient?.phone && <p className="text-xs text-slate-600">Contact: {bill.patient.phone}</p>}
            {bill.patient?.address && <p className="text-xs text-slate-600">Address: {bill.patient.address}</p>}
          </div>

          <div className="flex justify-start md:justify-end">
            <div className="w-full sm:w-4/5 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Billing Date:</span>
                <span className="font-bold text-slate-900">{bill.billingDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-xs items-center">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <StatusBadge status={bill.paymentStatus} />
              </div>
              {bill.paymentMethod && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Settlement Mode:</span>
                  <span className="font-semibold text-slate-900">{bill.paymentMethod}</span>
                </div>
              )}
              {bill.paymentDate && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Payment Date:</span>
                  <span className="font-semibold text-slate-900">{bill.paymentDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50/70 text-xs">
                <th className="py-3 px-4 text-slate-700 font-bold uppercase">Item / Clinical Service</th>
                <th className="py-3 px-4 text-slate-700 font-bold uppercase text-right">Charge (₹)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {consultCharge > 0 && (
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Specialist Clinical Consultation</td>
                  <td className="py-3 px-4 text-right font-medium">₹{consultCharge.toFixed(2)}</td>
                </tr>
              )}
              {roomCharge > 0 && (
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Inpatient Bed & Nursing Accommodation</td>
                  <td className="py-3 px-4 text-right font-medium">₹{roomCharge.toFixed(2)}</td>
                </tr>
              )}
              {medCharge > 0 && (
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Hospital Pharmacy Dispensation</td>
                  <td className="py-3 px-4 text-right font-medium">₹{medCharge.toFixed(2)}</td>
                </tr>
              )}
              {otherCharge > 0 && (
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Diagnostic Tests & Medical Supplies</td>
                  <td className="py-3 px-4 text-right font-medium">₹{otherCharge.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-1/2 md:w-2/5 space-y-2">
            <div className="flex justify-between text-xs py-1 text-slate-600">
              <span>Gross Charges (Subtotal):</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs py-1 text-emerald-600">
                <span>Institutional Discount:</span>
                <span className="font-semibold">-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs py-1 text-slate-600 border-b border-slate-100 pb-2">
              <span>GST / Healthcare Cess:</span>
              <span className="font-semibold text-slate-900">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-base font-extrabold text-slate-900 bg-slate-50 px-3 rounded-lg border border-slate-100">
              <span>Net Total Amount:</span>
              <span className="text-primary-800">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-2xs text-slate-400">
          <p className="font-semibold text-slate-600 mb-1">
            Official Computer-Generated Receipt — MediCore Healthcare Systems
          </p>
          <p>For inquiries, please contact accounts@medicore.com or visit the billing desk on Ground Floor.</p>
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Settle Statement #{bill.id || bill.billId}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Choose your preferred payment channel to settle this medical invoice.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Patient Name:</span>
                  <span className="font-bold text-slate-900">{patientName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Statement Total:</span>
                  <span className="font-bold text-slate-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Amount to Pay:</span>
                  <span className="text-emerald-700">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Payment Channel</p>
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
                    <span className="text-xs font-bold">Credit / Debit Card</span>
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
                    <span className="text-xs font-bold">Hospital Desk</span>
                    <span className="text-3xs text-slate-500 mt-0.5">Cash / Counter POS</span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPaymentModal(false)}
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
                {isProcessing ? 'Processing...' : `Confirm & Pay ₹${totalAmount.toFixed(2)}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
