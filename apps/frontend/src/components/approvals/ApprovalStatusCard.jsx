import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ApprovalStatusCard({ data }) {
  const getNextStepLabel = (status, level) => {
    if (status === 'APPROVED') return 'Generate Purchase Order';
    if (status === 'REJECTED') return 'RFQ Re-routing';
    if (status === 'REVISED') return 'Quotation Resubmission';
    return `Level ${level + 1} Authorization`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'REVISED':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Find name of current level approver
  const currentStep = data.history?.find((h) => h.level === data.currentLevel);

  return (
    <Card className="text-left bg-slate-50 border border-slate-200">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Workflow Status
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-black text-slate-800">Current Status</span>
            <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Current Approver</span>
            <span className="text-slate-800 font-bold">
              {currentStep?.approverName || 'Auto Route'}
            </span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Approval Level</span>
            <span className="text-slate-800 font-bold">Level {data.currentLevel} of 4</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Pending Since</span>
            <span className="text-slate-800 font-bold">Just Now</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Next Action</span>
            <span className="text-slate-800 font-black text-right">
              {getNextStepLabel(data.status, data.currentLevel)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
