import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, ClipboardList, Users, Calendar, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function RFQSummary({ isPublishMode }) {
  const { watch } = useFormContext();

  const title = watch('title');
  const items = watch('items') || [];
  const assignedVendorIds = watch('assignedVendorIds') || [];
  const deadline = watch('deadline');

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalBudget = items.reduce((sum, item) => sum + (Number(item.budget) || 0), 0);

  // Format Date Helper
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return 'Not configured';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (_) {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-6 text-left sticky top-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-200">RFQ Live Summary</h3>
        <Badge variant={isPublishMode ? 'info' : 'neutral'}>
          {isPublishMode ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            RFQ Title
          </span>
          <p className="text-xs font-bold text-slate-100 truncate mt-1">
            {title ? title : 'Untitled Procurement Request'}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ClipboardList className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Line Items</span>
            </div>
            <p className="mt-1 text-base font-black text-slate-100">{totalItems}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <FileText className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Quantity</span>
            </div>
            <p className="mt-1 text-base font-black text-slate-100">{totalQuantity}</p>
          </div>
        </div>

        {/* Budget & Vendors Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Assigned Vendors
              </span>
            </div>
            <p className="mt-1 text-base font-black text-slate-100">{assignedVendorIds.length}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Est. Budget
            </span>
            <p className="mt-1 text-base font-black text-[#A87D9F]">
              {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>

        {/* Timeline Deadline */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#A87D9F]" />
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Submission Deadline
            </span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5 truncate">
              {getFormattedDate(deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Validation warning helper */}
      {(!title || totalItems === 0 || assignedVendorIds.length === 0 || !deadline) && (
        <div className="mt-4 p-3 bg-amber-950/40 border border-amber-900/60 rounded-2xl flex items-start gap-2.5 text-amber-300 text-[10px] leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold block mb-0.5">Missing Required Fields</span>
            <span>
              You must complete the title, add at least one line item, set a deadline, and select a
              vendor before publishing.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
