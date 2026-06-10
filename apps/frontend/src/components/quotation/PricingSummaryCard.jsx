import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function PricingSummaryCard() {
  const { watch, setValue } = useFormContext();

  const subtotal = watch('subtotal') || 0;
  const gstPercent = watch('gstPercent') || 0;
  const otherTaxPercent = watch('otherTaxPercent') || 0;

  const gstAmount = subtotal * (Number(gstPercent) / 100);
  const otherTaxAmount = (subtotal * (Number(otherTaxPercent) || 0)) / 100;
  const grandTotal = subtotal + gstAmount + otherTaxAmount;

  // Sync grandTotal to RHF state
  useEffect(() => {
    setValue('grandTotal', grandTotal);
  }, [grandTotal, setValue]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold tracking-tight text-slate-200">Pricing Summary</h3>
        <p className="text-[10px] text-slate-400 font-medium">
          Billed pricing metrics auto-calculated in real time.
        </p>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-300 font-medium">
          <span>Subtotal</span>
          <span className="font-bold text-slate-100">{formatCurrency(subtotal)}</span>
        </div>

        {/* GST Amount */}
        <div className="flex justify-between items-center text-slate-400 font-medium">
          <span>GST ({gstPercent}%)</span>
          <span className="font-bold text-slate-200">+{formatCurrency(gstAmount)}</span>
        </div>

        {/* Other Tax Amount */}
        <div className="flex justify-between items-center text-slate-400 font-medium">
          <span>Other Tax ({otherTaxPercent}%)</span>
          <span className="font-bold text-slate-200">+{formatCurrency(otherTaxAmount)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-2" />

        {/* Grand Total */}
        <div className="flex justify-between items-center text-slate-100 font-bold">
          <span className="text-sm">Grand Total</span>
          <span className="text-lg font-black text-[#A87D9F]">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
