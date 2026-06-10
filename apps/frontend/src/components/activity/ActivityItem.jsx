import React from 'react';
import { FileText, ClipboardList, ShieldAlert, FileSpreadsheet, Receipt, UserPlus, CheckCircle2 } from 'lucide-react';

const ICON_MAP = {
  RFQ: FileText,
  Quotation: ClipboardList,
  Approval: ShieldAlert,
  PO: FileSpreadsheet,
  Invoice: Receipt,
  Vendor: UserPlus,
};

export default function ActivityItem({ item }) {
  const getStatusColor = () => {
    if (item.action.toLowerCase().includes('reject') || item.status === 'Rejected') {
      return 'bg-rose-500 border-rose-500';
    }
    if (item.action.toLowerCase().includes('pending') || item.status === 'Pending') {
      return 'bg-amber-500 border-amber-500';
    }
    return 'bg-[#714B67] border-[#714B67]';
  };

  const IconComponent = ICON_MAP[item.module] || CheckCircle2;


  return (
    <div className="relative pl-6 pb-6 last:pb-2">
      <div className={`absolute -left-2 top-1 h-4.5 w-4.5 rounded-full border-2 border-white flex items-center justify-center text-white ${getStatusColor()}`}>
        <IconComponent size={10} />
      </div>
      <div className="text-left">
        <span className="text-xs font-black text-slate-800 block">{item.action}</span>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.entity}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>By {item.user}</span>
          <span>•</span>
          <span>
            {new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
