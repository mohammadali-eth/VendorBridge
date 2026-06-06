import React from 'react';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { ApprovalRequest } from '../types/dashboard.types';
import { Check, X, ClipboardCheck } from 'lucide-react';

interface ApprovalQueueProps {
  queue?: ApprovalRequest[];
  loading: boolean;
}

export default function ApprovalQueue({ queue = [], loading }: ApprovalQueueProps) {
  const getPriorityVariant = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const columns = [
    {
      header: 'Request Detail',
      accessor: 'request',
      className: 'font-semibold text-slate-800 text-xs truncate max-w-[160px]',
    },
    {
      header: 'Dept',
      accessor: 'department',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row: ApprovalRequest) => (
        <span className="font-semibold text-slate-900 text-xs">
          {row.amount > 0 ? `₹${row.amount.toLocaleString('en-IN')}` : '-'}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row: ApprovalRequest) => (
        <Badge variant={getPriorityVariant(row.priority)} className="text-[10px] py-0.5 px-2">
          {row.priority}
        </Badge>
      ),
    },
    {
      header: 'Decide',
      render: (row: ApprovalRequest) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="p-1 hover:bg-emerald-50 text-slate-400 hover:text-[#16A34A] rounded-lg transition-colors cursor-pointer"
            title="Approve request"
          >
            <Check size={14} className="stroke-[3]" />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-[#DC2626] rounded-lg transition-colors cursor-pointer"
            title="Reject request"
          >
            <X size={14} className="stroke-[3]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Pending Approvals"
      subtitle="Pending tasks requiring manager review."
      bodyClassName="p-0 overflow-hidden"
      hoverLift={false}
    >
      <Table
        columns={columns}
        data={queue}
        loading={loading}
        rowKey={(row) => row.id}
        emptyState={
          <div className="flex flex-col items-center justify-center py-6 text-slate-400">
            <ClipboardCheck size={20} className="mb-2" />
            <p className="text-xs font-semibold">Queue Clear</p>
            <p className="text-[10px]">No pending approvals.</p>
          </div>
        }
      />
    </Card>
  );
}
