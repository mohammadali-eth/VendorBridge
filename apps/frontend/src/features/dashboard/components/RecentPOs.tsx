import React from 'react';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { PurchaseOrder } from '../types/dashboard.types';
import { ArrowRight, Eye, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentPOsProps {
  pos?: PurchaseOrder[];
  loading: boolean;
}

export default function RecentPOs({ pos = [], loading }: RecentPOsProps) {
  const getStatusVariant = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Draft':
        return 'neutral';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const columns = [
    {
      header: 'PO Number',
      accessor: 'poNumber',
      render: (row: PurchaseOrder) => (
        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-[#E5E7EB]">
          {row.poNumber}
        </span>
      ),
    },
    {
      header: 'Vendor',
      accessor: 'vendor',
      className: 'max-w-[150px] truncate',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row: PurchaseOrder) => (
        <span className="font-semibold text-slate-900">
          ₹{row.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: PurchaseOrder) => (
        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Actions',
      render: (row: PurchaseOrder) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#714B67] rounded-lg transition-colors cursor-pointer"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#714B67] rounded-lg transition-colors cursor-pointer"
            title="Edit draft"
          >
            <Edit2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Recent Purchase Orders"
      subtitle="Overview of recently raised purchase contracts."
      extra={
        <Link
          to="/purchase-orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#714B67] hover:text-[#583b51] transition-colors"
        >
          View All POs
          <ArrowRight size={14} />
        </Link>
      }
      bodyClassName="p-0 overflow-hidden"
      hoverLift={false}
    >
      <Table
        columns={columns}
        data={pos}
        loading={loading}
        rowKey={(row) => row.id}
      />
    </Card>
  );
}
