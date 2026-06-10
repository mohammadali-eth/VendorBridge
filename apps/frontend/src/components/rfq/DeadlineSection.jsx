import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';

export default function DeadlineSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Get current date string formatted as YYYY-MM-DD for min date selector attribute
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 text-left">
      <div>
        <h4 className="text-sm font-bold text-slate-800">Timeline & Deadlines</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Specify when bidding starts and the final submission date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RFQ Start Date */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            RFQ Start Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="date"
              min={todayStr}
              {...register('startDate')}
              className={`w-full bg-slate-50 border ${
                errors.startDate
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-[#714B67]'
              } rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.startDate && (
            <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.startDate.message}</p>
          )}
        </div>

        {/* Submission Deadline */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Submission Deadline <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="date"
              min={todayStr}
              {...register('deadline')}
              className={`w-full bg-slate-50 border ${
                errors.deadline
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-[#714B67]'
              } rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.deadline && (
            <p className="text-rose-600 text-[10px] mt-1 font-semibold">
              {errors.deadline.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
