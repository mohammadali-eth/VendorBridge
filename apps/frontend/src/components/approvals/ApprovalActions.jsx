import React from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';

export default function ApprovalActions({ onApprove, onReject, onSendBack, disabled, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        type="button"
        onClick={onApprove}
        disabled={disabled || loading}
        className="w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#583b51] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Check className="h-4 w-4" />
        Approve Request
      </button>

      <button
        type="button"
        onClick={onSendBack}
        disabled={disabled || loading}
        className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 text-slate-500" />
        Send Back for Revision
      </button>

      <button
        type="button"
        onClick={onReject}
        disabled={disabled || loading}
        className="w-full py-2.5 px-4 bg-rose-650 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <X className="h-4 w-4" />
        Reject Request
      </button>
    </div>
  );
}
