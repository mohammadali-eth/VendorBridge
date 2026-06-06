import React from 'react';
import Card from '../common/Card';

export default function ApprovalRemarks({ remarks, setRemarks, internalNotes, setInternalNotes, errors = {} }) {
  return (
    <Card className="text-left space-y-4">
      <div className="border-b border-slate-100 pb-3 mb-2">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Remarks & Internal Notes</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-450 block tracking-wider mb-1">
            Approval Comment <span className="text-rose-500 font-bold">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add comments or authorization reasons..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={`w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67] ${
              errors.remarks ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-200'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.remarks ? (
              <span className="text-[10px] text-rose-500 font-bold">{errors.remarks}</span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">Required for rejection / revision.</span>
            )}
            <span className="text-[10px] text-slate-400 font-bold shrink-0">{remarks.length} chars</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-450 block tracking-wider mb-1">
            Internal Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add private logs or internal tracking information..."
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
          />
        </div>
      </div>
    </Card>
  );
}
