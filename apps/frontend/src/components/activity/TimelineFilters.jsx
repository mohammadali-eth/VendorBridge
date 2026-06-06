import React from 'react';

export default function TimelineFilters({ active, onChange }) {
  const tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'RFQ', value: 'RFQ' },
    { label: 'Approvals', value: 'Approval' },
    { label: 'Invoices', value: 'Invoice' },
    { label: 'Vendors', value: 'Vendor' },
    { label: 'Purchase Orders', value: 'PO' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            active === tab.value
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
