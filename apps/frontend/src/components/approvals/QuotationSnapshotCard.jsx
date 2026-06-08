import React from 'react';
import Card from '../common/Card';
import { Star } from 'lucide-react';

export default function QuotationSnapshotCard({ snapshot }) {
  if (!snapshot) return null;

  return (
    <Card className="text-left">
      <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Quotation Snapshot</h3>
        <div className="flex items-center gap-1 bg-amber-55 px-2 py-0.5 rounded-lg border border-amber-200">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <span className="text-[10px] font-black text-amber-800">{snapshot.vendorRating || '4.0'} / 5</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-bold">Vendor Name</span>
          <span className="text-slate-800 font-black text-right">{snapshot.vendorName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-bold">Subtotal</span>
          <span className="text-slate-800 font-black">₹{snapshot.subtotal?.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-bold">GST ({snapshot.gstPercent}%)</span>
          <span className="text-slate-800 font-black">₹{snapshot.gstAmount?.toLocaleString('en-IN')}</span>
        </div>
        {snapshot.otherTaxPercent > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Other Tax ({snapshot.otherTaxPercent}%)</span>
            <span className="text-slate-800 font-black">₹{snapshot.otherTaxAmount?.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-bold">Discount</span>
          <span className="text-emerald-600 font-black">-₹{snapshot.discount?.toLocaleString('en-IN') || '0'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-bold">Expected Delivery</span>
          <span className="text-slate-800 font-black">{snapshot.deliveryDays} Days</span>
        </div>

        <div className="h-px bg-slate-100 my-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-black text-slate-800">Final Total</span>
          <span className="text-lg font-black text-[#714B67]">
            ₹{snapshot.finalTotal?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </Card>
  );
}
