import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import invoiceService from '../../services/invoiceService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Loader2, ArrowLeft, Download, Printer, Mail, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Status and terms edit states
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [invoiceStatus, setInvoiceStatus] = useState('GENERATED');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await invoiceService.getInvoice(invoiceId);
        setInvoice(data);
        setPaymentTerms(data.paymentTerms);
        setInvoiceStatus(data.status);
      } catch (err) {
        console.error(err);
        setError('Failed to load invoice details.');
      } finally {
        setLoading(false);
      }
    }
    if (invoiceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [invoiceId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const updated = await invoiceService.updateStatus(invoiceId, newStatus);
      setInvoice(updated);
      setInvoiceStatus(updated.status);
      showToast(`Invoice status updated to ${newStatus}!`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleEmailInvoice = async () => {
    try {
      const res = await invoiceService.emailInvoice(invoiceId);
      showToast(res.message || 'Invoice successfully emailed!', 'success');
      // Reload to see updated status (Sent)
      const data = await invoiceService.getInvoice(invoiceId);
      setInvoice(data);
      setInvoiceStatus(data.status);
    } catch (err) {
      showToast('Failed to send email', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const token = useAuthStore.getState().accessToken;
    showToast('Downloading invoice PDF...');
    window.open(`/api/v1/invoices/${invoiceId}/download?token=${token}`, '_blank');
  };

  if (loading && !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Invoice Preview...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Invoice Not Found</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">{error}</p>
        <button
          onClick={() => navigate('/invoices')}
          className="py-2 px-4 bg-[#714B67] text-white rounded-xl text-xs font-bold"
        >
          Return to Inbox
        </button>
      </div>
    );
  }

  const rawItems = invoice.purchaseOrder?.quotation?.items;
  const items = (() => {
    if (!rawItems) return [];
    if (Array.isArray(rawItems)) return rawItems;
    if (typeof rawItems === 'string') {
      try {
        const parsed = JSON.parse(rawItems);
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        return [];
      }
    }
    return [];
  })();

  const subtotal = parseFloat(invoice.subtotal?.toString() || 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const totalTax = cgst + sgst;
  const grandTotal = subtotal + totalTax;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'SENT':
      case 'GENERATED':
        return 'info';
      case 'OVERDUE':
        return 'danger';
      case 'PENDING_PAYMENT':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  // Build sequential timeline activities dynamically based on status
  const timelineSteps = [
    {
      label: 'RFQ Created',
      date: new Date(invoice.purchaseOrder?.createdAt).getTime() - 86400000 * 2,
      completed: true,
    },
    {
      label: 'Quotation Submitted',
      date: new Date(invoice.purchaseOrder?.createdAt).getTime() - 86400000,
      completed: true,
    },
    {
      label: 'Quotation Approved',
      date: new Date(invoice.purchaseOrder?.createdAt).getTime(),
      completed: true,
    },
    {
      label: 'PO Generated',
      date: new Date(invoice.purchaseOrder?.createdAt).getTime(),
      completed: true,
    },
    { label: 'Invoice Generated', date: new Date(invoice.invoiceDate).getTime(), completed: true },
    {
      label: 'Invoice Sent',
      date: new Date(invoice.invoiceDate).getTime(),
      completed: invoice.status === 'SENT' || invoice.status === 'PAID',
    },
    {
      label: 'Payment Received',
      date: new Date(invoice.updatedAt).getTime(),
      completed: invoice.status === 'PAID',
    },
  ];

  return (
    <div className="space-y-8 text-left pb-16 print:p-0 print:space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2 py-3 px-5 rounded-2xl shadow-xl text-xs font-bold border transition-all text-white ${
            toast.type === 'error'
              ? 'bg-rose-600 border-rose-500'
              : 'bg-emerald-600 border-emerald-500'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <h2 className="text-2xl font-black text-[#111827] tracking-tight">Invoice Details</h2>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-6">
            Dashboard &rarr; Vendor &rarr; RFQ &rarr; Quotation &rarr; Approval &rarr; PO &rarr;
            Invoice Details
          </p>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left main Invoice visual preview sheet */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs print:border-none print:shadow-none print:p-0 space-y-6">
          <div className="flex justify-between items-start border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-xl font-black text-[#714B67] tracking-tight">VendorBridge</h1>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                PO-2024-auto-generated after approval
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Invoice Receipt
              </h2>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                Original Duplicate Copy
              </span>
            </div>
          </div>

          {/* Billing metadata cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed font-semibold border-b border-slate-100 pb-5">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                Bill To:
              </span>
              <p className="text-slate-900 font-black">VendorBridge Ltd</p>
              <p>123 Business Park, Ahmedabad, India</p>
              <p>GSTIN: 2538348AFB</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                Vendor:
              </span>
              <p className="text-slate-900 font-black">{invoice.vendor?.name}</p>
              <p>{invoice.vendor?.address || 'Industrial Estate, Surat, India'}</p>
              <p>GSTIN: {invoice.vendor?.gstNumber || '343434DB4523'}</p>
            </div>
          </div>

          {/* Document metadata block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold py-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Invoice Number
              </span>
              <span className="text-slate-900 font-black block mt-0.5">
                {invoice.invoiceNumber}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                PO Reference
              </span>
              <span className="text-[#714B67] font-black block mt-0.5">
                {invoice.purchaseOrder?.poNumber}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Invoice Date
              </span>
              <span className="text-slate-800 font-bold block mt-0.5">
                {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Due Date
              </span>
              <span className="text-rose-600 font-bold block mt-0.5">
                {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-150 rounded-2xl overflow-hidden mt-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[9px]">
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 font-medium">
                      No invoice items.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 text-slate-900 font-black">{item.description}</td>
                      <td className="py-2.5 px-4 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-4 text-right">
                        ₹{parseFloat(item.price || item.unitPrice || 0)?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-900 font-black">
                        ₹
                        {(
                          (item.quantity || 1) * parseFloat(item.price || item.unitPrice || 0)
                        )?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary blocks */}
          <div className="flex justify-end pt-4">
            <div className="w-full sm:max-w-xs space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%)</span>
                <span>₹{cgst?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%)</span>
                <span>₹{sgst?.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-slate-150 my-1" />
              <div className="flex justify-between text-slate-900 font-black text-sm">
                <span>Grand Total</span>
                <span className="text-[#714B67]">₹{grandTotal?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Quick status & paid trigger at bottom */}
          <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Status:</span>
              <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
            </div>

            {invoice.status !== 'PAID' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('PAID')}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-xs cursor-pointer"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        {/* Right column sidebar controls */}
        <div className="space-y-6 print:hidden">
          {/* Actions card */}
          <Card className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-2">
              Document Actions
            </h4>

            <button
              onClick={handleDownload}
              className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="h-4 w-4 text-slate-500" />
              Download PDF
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              Print Invoice
            </button>

            <button
              onClick={handleEmailInvoice}
              className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Mail className="h-4 w-4 text-slate-500" />
              Email Invoice
            </button>

            <div className="h-px bg-slate-100 my-2" />

            <div className="space-y-3">
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  Manage Status
                </label>
                <select
                  value={invoiceStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="GENERATED">Generated</option>
                  <option value="SENT">Sent</option>
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-500 focus:outline-none"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2">
              Lifecycle timeline
            </h4>
            <div className="relative border-l border-slate-100 ml-2.5 pl-5 space-y-4">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 flex items-center justify-center ${
                      step.completed ? 'bg-[#714B67] border-[#714B67]' : 'bg-white border-slate-350'
                    }`}
                  >
                    {step.completed && <div className="h-1 w-1 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span
                      className={`text-[11px] block ${step.completed ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                      {new Date(step.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
