import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CalendarDays, Percent } from 'lucide-react';

export default function DeliveryInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-left">
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery & Taxes</h4>
        <p className="text-[11px] text-slate-400 font-medium">Specify your delivery timeline and tax percentages.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Delivery Days */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Delivery Time (Days) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="number"
              placeholder="e.g. 7"
              {...register('deliveryDays', { valueAsNumber: true })}
              className={`w-full bg-slate-50 border ${
                errors.deliveryDays ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-250 focus:ring-[#714B67]'
              } rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.deliveryDays && (
            <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.deliveryDays.message}</p>
          )}
        </div>

        {/* GST % */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            GST %
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="number"
              placeholder="18"
              {...register('gstPercent', { valueAsNumber: true })}
              className={`w-full bg-slate-50 border ${
                errors.gstPercent ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-250 focus:ring-[#714B67]'
              } rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.gstPercent && (
            <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.gstPercent.message}</p>
          )}
        </div>

        {/* Other Tax % */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Other Tax %
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="number"
              placeholder="2"
              {...register('otherTaxPercent', { valueAsNumber: true })}
              className={`w-full bg-slate-50 border ${
                errors.otherTaxPercent ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-250 focus:ring-[#714B67]'
              } rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.otherTaxPercent && (
            <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.otherTaxPercent.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
