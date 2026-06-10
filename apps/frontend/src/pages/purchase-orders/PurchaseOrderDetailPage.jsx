import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import poService from '../../services/poService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Loader2, ArrowLeft, Receipt, CheckCircle2 } from 'lucide-react';

export default function PurchaseOrderDetailPage() {
  const { poId } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for invoice generation
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await poService.getPurchaseOrder(poId);
        setPo(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load Purchase Order details.');
      } finally {
        setLoading(false);
      }
    }
    if (poId) loadData();
  }, [poId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateInvoice = async () => {
    if (!dueDate) {
      showToast('Please select a due date for the invoice', 'error');
      return;
    }
    setGeneratingInvoice(true);
    try {
      const invoice = await poService.createInvoice(poId, dueDate, paymentTerms);
      showToast('Invoice generated successfully!', 'success');
      setTimeout(() => {
        navigate(`/invoices/${invoice.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to generate invoice', 'error');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading && !po) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Purchase Order Details...</span>
      </div>
    );
  }

  if (error || !po) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Purchase Order Not Found</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">{error}</p>
        <button
          onClick={() => navigate('/purchase-orders')}
          className="py-2 px-4 bg-[#714B67] text-white rounded-xl text-xs font-bold"
        >
          Return to List
        </button>
      </div>
    );
  }

  // Parse quotation items
  const rawItems = po.quotation?.items;
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
  const subtotal = parseFloat(po.quotation?.subtotal?.toString() || 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const totalTax = cgst + sgst;
  const grandTotal = subtotal + totalTax;

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2 py-3 px-5 rounded-2xl shadow-xl text-xs font-bold border transition-all text-white ${
          toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-emerald-600 border-emerald-500'
        }`}>
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Purchase Order Details</h2>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-6">
          Dashboard &rarr; Vendor &rarr; RFQ &rarr; Quotation &rarr; Approval &rarr; PO Details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: PO metadata and Items table */}
        <div className="lg:col-span-2 space-y-6">
          {/* PO Summary Card */}
          <Card className="space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-800">PO Number: {po.poNumber}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  RFQ Ref: {po.quotation?.rfq?.title || 'Linked RFQ'}
                </span>
              </div>
              <Badge variant={po.status === 'DELIVERED' ? 'success' : 'info'}>{po.status}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Generated Date
                </span>
                <span className="text-slate-800 font-bold block mt-0.5">
                  {new Date(po.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Vendor Name
                </span>
                <span className="text-slate-800 font-bold block mt-0.5">{po.vendor?.name}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Value
                </span>
                <span className="text-[#714B67] font-black block mt-0.5">
                  ₹{parseFloat(po.totalAmount.toString())?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>

          {/* Org & Vendor Address Cards side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-3">
                Buyer Info (Bill To)
              </h4>
              <div className="text-xs space-y-1.5 font-semibold text-slate-600">
                <p className="text-slate-900 font-black">VendorBridge Ltd</p>
                <p>GSTIN: 2538348AFB</p>
                <p>123 Business Park, Ahmedabad, India</p>
                <p className="text-[10px] text-slate-400 mt-1">Contact: {po.buyer?.email || 'procurement@vendorbridge.com'}</p>
              </div>
            </Card>

            <Card>
              <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-3">
                Vendor Info (Ship From)
              </h4>
              <div className="text-xs space-y-1.5 font-semibold text-slate-600">
                <p className="text-slate-900 font-black">{po.vendor?.name}</p>
                <p>GSTIN: {po.vendor?.gstNumber || '343434DB4523'}</p>
                <p>{po.vendor?.address || 'Industrial Estate, Surat, India'}</p>
                <p className="text-[10px] text-slate-400 mt-1">Email: {po.vendor?.email}</p>
              </div>
            </Card>
          </div>

          {/* Items Table */}
          <Card className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2">
              Purchase Items
            </h4>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4 text-center">Quantity</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 font-medium">
                        No items found in this purchase order.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 text-slate-800 font-black">{item.description}</td>
                        <td className="py-2.5 px-4 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-4 text-right">
                          ₹{parseFloat(item.price || item.unitPrice || 0)?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-900">
                          ₹{((item.quantity || 1) * parseFloat(item.price || item.unitPrice || 0))?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:max-w-xs space-y-2 text-xs font-semibold">
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
                <div className="h-px bg-slate-100 my-1" />
                <div className="flex justify-between text-slate-800 font-black text-sm">
                  <span>Grand Total</span>
                  <span className="text-[#714B67]">₹{grandTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Invoice Generation Section */}
        <div className="space-y-6">
          {po.invoices && po.invoices.length > 0 ? (
            <Card className="bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="h-5 w-5 text-emerald-600" />
                <h4 className="text-xs font-black text-emerald-800">Associated Invoice</h4>
              </div>
              <p className="text-xs font-semibold text-slate-650 leading-relaxed mb-4">
                An invoice has already been generated from this Purchase Order.
              </p>
              <button
                onClick={() => navigate(`/invoices/${po.invoices[0].id}`)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                View Invoice Preview
              </button>
            </Card>
          ) : (
            <Card className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-800">Generate Invoice</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Create official invoice request from PO</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-450 block tracking-wider mb-1">
                    Invoice Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-455 block tracking-wider mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleCreateInvoice}
                  disabled={generatingInvoice}
                  className="w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#583b51] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {generatingInvoice ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Receipt className="h-4 w-4" />
                      Generate Invoice
                    </>
                  )}
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
