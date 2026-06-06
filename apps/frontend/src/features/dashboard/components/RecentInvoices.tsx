import React from 'react';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { Invoice } from '../types/dashboard.types';
import { ArrowRight, Download, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentInvoicesProps {
  invoices?: Invoice[];
  loading: boolean;
}

export default function RecentInvoices({ invoices = [], loading }: RecentInvoicesProps) {
  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const columns = [
    {
      header: 'Invoice No',
      accessor: 'invoiceNo',
      render: (row: Invoice) => (
        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-[#E5E7EB] flex items-center gap-1.5 w-fit">
          <Receipt size={12} className="text-slate-400" />
          {row.invoiceNo}
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
      render: (row: Invoice) => (
        <span className="font-semibold text-slate-900">
          ₹{row.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: Invoice) => (
        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row: Invoice) => (
        <button
          type="button"
          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#714B67] rounded-lg transition-colors cursor-pointer"
          title="Download Invoice PDF"
        >
          <Download size={15} />
        </button>
      ),
    },
  ];

  return (
    <Card
      title="Recent Invoices"
      subtitle="Track incoming supplier bills and due schedules."
      extra={
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#714B67] hover:text-[#583b51] transition-colors"
        >
          View All Invoices
          <ArrowRight size={14} />
        </Link>
      }
      bodyClassName="p-0 overflow-hidden"
      hoverLift={false}
    >
      <Table
        columns={columns}
        data={invoices}
        loading={loading}
        rowKey={(row) => row.id}
      />
    </Card>
  );
}
