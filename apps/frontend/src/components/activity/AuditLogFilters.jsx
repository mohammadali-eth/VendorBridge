import React from 'react';
import { Search } from 'lucide-react';

export default function AuditLogFilters({
  search,
  setSearch,
  moduleFilter,
  setModuleFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const modules = [
    { label: 'All Modules', value: 'ALL' },
    { label: 'RFQ', value: 'RFQ' },
    { label: 'Vendors', value: 'Vendor' },
    { label: 'Quotations', value: 'Quotation' },
    { label: 'Approvals', value: 'Approval' },
    { label: 'Purchase Orders', value: 'PO' },
    { label: 'Invoices', value: 'Invoice' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {/* Search */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          Global Search
        </label>
        <div className="relative text-slate-455 focus-within:text-[#714B67]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={14} />
          </span>
          <input
            type="search"
            placeholder="Search user, action, entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
          />
        </div>
      </div>

      {/* Module */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          Module Filter
        </label>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
        >
          {modules.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
        />
      </div>

      {/* End Date */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
        />
      </div>
    </div>
  );
}
