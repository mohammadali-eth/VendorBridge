import React from 'react';
import { useFormContext } from 'react-hook-form';

import ItemTable from './ItemTable';
import VendorSelector from './VendorSelector';

export default function RFQForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Left Column: RFQ Inputs */}
      <div className="space-y-4">
        {/* RFQ's title */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">RFQ&apos;s title*</label>
          <input
            type="text"
            {...register('title')}
            placeholder="Office Furniture procurement Q2"
            className={`w-full bg-slate-50 border ${
              errors.title
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:ring-[#714B67]'
            } rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2`}
          />
          {errors.title && (
            <p className="text-rose-600 text-[10px] mt-1 font-semibold">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
          <div className="relative">
            <select
              {...register('category')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#714B67]"
            >
              <option value="Furniture">Furniture</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
              <option value="Equipment">Equipment</option>
              <option value="Software">Software</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.category && (
            <p className="text-rose-600 text-[10px] mt-1 font-semibold">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Deadline*</label>
          <input
            type="date"
            min={todayStr}
            {...register('deadline')}
            className={`w-full bg-slate-50 border ${
              errors.deadline
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:ring-[#714B67]'
            } rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2`}
          />
          {errors.deadline && (
            <p className="text-rose-600 text-[10px] mt-1 font-semibold">
              {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Ergonomic chairs and standing desks for 3rd floor"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#714B67]"
          />
        </div>
      </div>

      {/* Right Column: Line Items & Vendor Selector */}
      <div className="space-y-6">
        <ItemTable />
        <VendorSelector />
      </div>
    </div>
  );
}
