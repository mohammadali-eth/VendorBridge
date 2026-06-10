import React from 'react';
import { HelpCircle, X, Loader2 } from 'lucide-react';

export default function VendorSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  selectedVendor,
  loading = false,
}) {
  if (!isOpen || !selectedVendor) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <HelpCircle className="h-5 w-5 text-[#714B67]" />
            <h3 className="text-sm font-bold">Confirm Selection</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-left space-y-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Are you sure you want to select this vendor? This action will save the decision and move
            the RFQ Status to{' '}
            <span className="font-bold text-[#714B67] bg-[#F5EEF4] px-1.5 py-0.5 rounded-md text-[10px] uppercase">
              Pending Approval
            </span>
            .
          </p>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                Vendor Name
              </span>
              <span className="font-black text-slate-800">{selectedVendor.vendorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                Grand Total
              </span>
              <span className="font-black text-[#714B67]">
                {formatCurrency(selectedVendor.grandTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                Delivery timeline
              </span>
              <span className="font-bold text-slate-700">{selectedVendor.deliveryDays} Days</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border border-slate-350 hover:bg-slate-100 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 bg-[#714B67] hover:bg-[#583b51] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}
