import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function NotesTextarea() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const notesValue = watch('notes') || '';
  const charCount = notesValue.length;

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Notes & Comments
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Specify payment terms, warranty, or delivery conditions.
          </p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
          {charCount} / 1000
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={4}
          maxLength={1000}
          placeholder="e.g. Payment terms: Net 30 days. Warranty information: 2 years on-site support. Delivery conditions: DDP Delhi."
          {...register('notes')}
          className={`w-full bg-slate-50 border ${
            errors.notes
              ? 'border-rose-300 focus:ring-rose-500'
              : 'border-slate-250 focus:ring-[#714B67]'
          } rounded-3xl py-3 px-4 text-xs focus:outline-none focus:ring-2`}
        />
        {errors.notes && (
          <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.notes.message}</p>
        )}
      </div>
    </div>
  );
}
