import React from 'react';
import Badge from '../common/Badge';
import { Calendar, Tag, Layers, ClipboardList } from 'lucide-react';

export default function RFQSummaryCard({ rfq }) {
  if (!rfq) return null;

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (_) {
      return dateStr;
    }
  };

  // Convert status color variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'neutral';
      default:
        return 'info';
    }
  };

  const rfqNumber = `RFQ-${new Date(rfq.createdAt).getFullYear()}-${rfq.title.charCodeAt(0) || 101}`;
  const items = Array.isArray(rfq.items) ? rfq.items : [];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-left space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{rfqNumber}</span>
          <h3 className="text-lg font-black text-slate-900 leading-tight">{rfq.title}</h3>
          {rfq.description && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">{rfq.description}</p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Badge variant={getStatusVariant(rfq.status)}>
            {rfq.status === 'PUBLISHED' ? 'Open' : rfq.status}
          </Badge>
        </div>
      </div>

      {/* Details Meta Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F5EEF4] text-[#714B67]">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Procurement Category</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{rfq.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F5EEF4] text-[#714B67]">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Deadline</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{getFormattedDate(rfq.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F5EEF4] text-[#714B67]">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority Level</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{rfq.priority}</span>
          </div>
        </div>
      </div>

      {/* Required Line Items Card List */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ClipboardList className="h-4 w-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Required Items Summary</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div key={index} className="p-3.5 border border-slate-150 rounded-2xl bg-white space-y-1 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold text-slate-800 block truncate">{item.name}</span>
                <span className="text-xs font-black text-[#714B67] bg-[#F5EEF4] px-2 py-0.5 rounded-lg shrink-0">
                  {item.quantity} {item.unit}
                </span>
              </div>
              {item.description && (
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed truncate">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
