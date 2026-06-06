import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { approvalService } from '../../services/approvalService';
import { Loader2, ClipboardCheck, ArrowRight } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function ApprovalsInboxPage() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await approvalService.getApprovals();
        setApprovals(data || []);
      } catch (err) {
        console.error('Failed to fetch approvals inbox', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Approvals Inbox...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Approvals Inbox</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Review, authorize, or reject purchase requisitions and supplier contracts.
          </p>
        </div>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
          <ClipboardCheck className="h-10 w-10 mx-auto text-slate-350" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">No Approvals Pending</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Your inbox is clean! There are currently no purchase requisitions awaiting approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">RFQ / Procurement Item</th>
                  <th className="py-4 px-6">Selected Vendor</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Stage Level</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date Initiated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                {approvals.map((app) => {
                  const rfqYear = new Date(app.createdAt).getFullYear();
                  const rfqChar = app.rfq?.title?.charCodeAt(0) || 101;
                  const rfqNumber = `RFQ-${rfqYear}-${rfqChar}`;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider block">
                          {rfqNumber}
                        </span>
                        <span className="text-slate-900 font-black leading-tight">
                          {app.rfq?.title}
                        </span>
                      </td>
                      <td className="py-4 px-6">{app.vendor?.name}</td>
                      <td className="py-4 px-6 font-black text-slate-900">
                        ₹{app.quotation?.grandTotal?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-800 font-bold block">
                          Level {app.currentLevel} of 4
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Approver Chain
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/approvals/${app.id}`)}
                          className="py-1.5 px-3 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-[10px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          Process
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
