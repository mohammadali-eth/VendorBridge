import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../services/invoiceService';
import { Loader2, Receipt, ArrowRight, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await invoiceService.getInvoices();
        setInvoices(data || []);
      } catch (err) {
        console.error('Failed to load invoices', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'SENT':
      case 'GENERATED':
        return 'info';
      case 'OVERDUE':
        return 'danger';
      case 'PENDING_PAYMENT':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Invoices Inbox...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Invoices</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Review, track, and manage official payment invoices and due schedules.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative text-slate-455 focus-within:text-[#714B67] w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} />
          </span>
          <input
            type="search"
            placeholder="Search invoice number or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs text-slate-400 font-bold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
          >
            <option value="ALL">All Invoices</option>
            <option value="DRAFT">Draft</option>
            <option value="GENERATED">Generated</option>
            <option value="SENT">Sent</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
          <Receipt className="h-10 w-10 mx-auto text-slate-350" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">No Invoices Found</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              There are no invoices matching your search or status criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-6">PO Reference</th>
                  <th className="py-4 px-6">Vendor</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-4 px-6 text-slate-500 font-bold">
                      {inv.purchaseOrder?.poNumber}
                    </td>
                    <td className="py-4 px-6">{inv.vendor?.name}</td>
                    <td className="py-4 px-6 font-black text-slate-900">
                      ₹{parseFloat(inv.totalAmount.toString())?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusVariant(inv.status)}>{inv.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {new Date(inv.dueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                        className="py-1.5 px-3 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-[10px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        Preview
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
