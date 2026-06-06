import React from 'react';
import Card from '../common/Card';

export default function ApprovalSummaryCard({ data }) {
  const fields = [
    { label: 'RFQ ID', value: data.rfqNumber },
    { label: 'RFQ Title', value: data.rfqTitle },
    { label: 'Department', value: data.department || 'Procurement' },
    { label: 'Requested By', value: data.requestedBy },
    { label: 'Vendor Name', value: data.vendorName },
    { label: 'Quotation Value', value: `₹${data.quotationValue?.toLocaleString('en-IN')}` },
    { label: 'Expected Delivery', value: data.expectedDelivery },
    { label: 'Priority', value: data.priority },
  ];

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-rose-600 font-bold';
      case 'medium':
        return 'text-amber-600 font-bold';
      default:
        return 'text-emerald-600 font-bold';
    }
  };

  return (
    <Card className="text-left">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Procurement Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        {fields.map((field) => (
          <div key={field.label}>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {field.label}
            </span>
            <span
              className={`text-xs text-slate-800 font-black mt-0.5 block ${
                field.label === 'Priority' ? getPriorityStyle(field.value) : ''
              }`}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
