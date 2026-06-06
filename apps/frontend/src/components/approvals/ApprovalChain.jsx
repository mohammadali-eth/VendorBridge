import React from 'react';
import Card from '../common/Card';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function ApprovalChain({ history = [], currentLevel }) {
  const getStatusIcon = (status, level) => {
    if (status === 'APPROVED') {
      return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
    }
    if (status === 'REJECTED') {
      return <XCircle className="h-5 w-5 text-rose-500 shrink-0" />;
    }
    if (status === 'REVISED') {
      return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
    }
    if (level === currentLevel) {
      return <HelpCircle className="h-5 w-5 text-[#714B67] animate-pulse shrink-0" />;
    }
    return <HelpCircle className="h-5 w-5 text-slate-300 shrink-0" />;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'REVISED':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Card className="text-left">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Approval Authorization Chain</h3>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
        {history.map((step) => {
          const isActive = step.level === currentLevel;
          const isPending = step.status === 'PENDING';

          return (
            <div key={step.level} className="relative">
              {/* Icon marker */}
              <div className="absolute -left-[37px] top-0.5 bg-white p-1 rounded-full">
                {getStatusIcon(step.status, step.level)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">
                      Level {step.level}: {step.role}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                      {step.approverName || 'TBD (Auto Route)'}
                    </span>
                  </div>
                  <Badge variant={isActive && isPending ? 'info' : getStatusBadgeVariant(step.status)}>
                    {isActive && isPending ? 'Current Approver' : step.status}
                  </Badge>
                </div>

                {step.date && (
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">
                    Processed: {new Date(step.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}

                {step.remarks && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-2">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Remarks</span>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                      "{step.remarks}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
