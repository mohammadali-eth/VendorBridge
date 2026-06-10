import React from 'react';
import { Star, ShieldAlert, Check, Zap, DollarSign } from 'lucide-react';

export default function ComparisonTable({
  quotations = [],
  onSelectVendor,
}) {
  if (quotations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
        <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 mb-2" />
        <p className="text-xs font-semibold">No quotations match the active filter criteria.</p>
      </div>
    );
  }

  // Calculate minimum grand total and fastest delivery days for badge highlights
  const grandTotals = quotations.map((q) => q.grandTotal);
  const minGrandTotal = Math.min(...grandTotals);

  const deliveryTimes = quotations.map((q) => q.deliveryDays);
  const minDeliveryDays = Math.min(...deliveryTimes);

  const ratings = quotations.map((q) => q.vendorRating);
  const maxRating = Math.max(...ratings);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm text-left">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-xs">
          <thead>
            <tr className="bg-slate-50/70">
              <th scope="col" className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                Criteria
              </th>
              {quotations.map((q) => {
                const isLowestPrice = q.grandTotal === minGrandTotal;
                return (
                  <th
                    key={q.vendorId}
                    scope="col"
                    className={`px-6 py-4 font-black text-slate-800 text-center relative border-l border-slate-100 ${
                      isLowestPrice ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <span className="block text-sm text-[#714B67] truncate max-w-[150px] mx-auto">{q.vendorName}</span>
                    {isLowestPrice && (
                      <span className="inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        <DollarSign className="h-2.5 w-2.5" />
                        Lowest Cost
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* --- Section Header: Financial --- */}
            <tr className="bg-slate-50/30">
              <td colSpan={quotations.length + 1} className="px-6 py-2 font-bold text-[#714B67] bg-slate-50/50 uppercase tracking-widest text-[9px]">
                Financial Metrics
              </td>
            </tr>
            {/* Grand Total */}
            <tr>
              <td className="px-6 py-3.5 font-bold text-slate-700">Grand Total</td>
              {quotations.map((q) => {
                const isLowestPrice = q.grandTotal === minGrandTotal;
                return (
                  <td
                    key={q.vendorId}
                    className={`px-6 py-3.5 text-center font-black text-sm border-l border-slate-100 ${
                      isLowestPrice ? 'text-emerald-700 bg-emerald-50/20 font-black' : 'text-slate-800'
                    }`}
                  >
                    {formatCurrency(q.grandTotal)}
                  </td>
                );
              })}
            </tr>
            {/* GST */}
            <tr>
              <td className="px-6 py-3.5 text-slate-500 font-medium">GST Amount</td>
              {quotations.map((q) => (
                <td key={q.vendorId} className="px-6 py-3.5 text-center text-slate-600 border-l border-slate-100">
                  {formatCurrency((q.subtotal * q.gst) / 100)} ({q.gst}%)
                </td>
              ))}
            </tr>
            {/* Subtotal */}
            <tr>
              <td className="px-6 py-3.5 text-slate-500 font-medium">Subtotal</td>
              {quotations.map((q) => (
                <td key={q.vendorId} className="px-6 py-3.5 text-center text-slate-600 border-l border-slate-100">
                  {formatCurrency(q.subtotal)}
                </td>
              ))}
            </tr>

            {/* --- Section Header: Delivery --- */}
            <tr className="bg-slate-50/30">
              <td colSpan={quotations.length + 1} className="px-6 py-2 font-bold text-[#714B67] bg-slate-50/50 uppercase tracking-widest text-[9px]">
                Logistics & Timeline
              </td>
            </tr>
            {/* Delivery Days */}
            <tr>
              <td className="px-6 py-3.5 font-bold text-slate-700">Delivery Days</td>
              {quotations.map((q) => {
                const isFastest = q.deliveryDays === minDeliveryDays;
                return (
                  <td
                    key={q.vendorId}
                    className={`px-6 py-3.5 text-center border-l border-slate-100 font-bold ${
                      isFastest ? 'text-blue-700 bg-blue-50/10' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{q.deliveryDays} Days</span>
                      {isFastest && <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* --- Section Header: Vendor Quality --- */}
            <tr className="bg-slate-50/30">
              <td colSpan={quotations.length + 1} className="px-6 py-2 font-bold text-[#714B67] bg-slate-50/50 uppercase tracking-widest text-[9px]">
                Vendor Reputation
              </td>
            </tr>
            {/* Vendor Rating */}
            <tr>
              <td className="px-6 py-3.5 font-bold text-slate-700">Vendor Rating</td>
              {quotations.map((q) => {
                const isHighestRating = q.vendorRating === maxRating;
                return (
                  <td
                    key={q.vendorId}
                    className="px-6 py-3.5 border-l border-slate-100 align-middle"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-bold text-slate-800">{q.vendorRating} / 5</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                      {isHighestRating && (
                        <span className="px-1.5 py-0.2 bg-[#F5EEF4] text-[#714B67] text-[8px] font-bold rounded">TOP</span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* --- Section Header: Commercial --- */}
            <tr className="bg-slate-50/30">
              <td colSpan={quotations.length + 1} className="px-6 py-2 font-bold text-[#714B67] bg-slate-50/50 uppercase tracking-widest text-[9px]">
                Contract terms
              </td>
            </tr>
            {/* Payment Terms */}
            <tr>
              <td className="px-6 py-3.5 text-slate-500 font-medium">Payment Terms</td>
              {quotations.map((q) => (
                <td key={q.vendorId} className="px-6 py-3.5 text-center text-slate-600 border-l border-slate-100 truncate max-w-[140px]">
                  {q.paymentTerms}
                </td>
              ))}
            </tr>

            {/* --- Action Selection Row --- */}
            <tr className="bg-slate-50/40">
              <td className="px-6 py-5 font-bold text-slate-700">Selection Action</td>
              {quotations.map((q) => (
                <td key={q.vendorId} className="px-6 py-5 text-center border-l border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectVendor(q)}
                    className="py-1.5 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-[10px] font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Select Vendor
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
