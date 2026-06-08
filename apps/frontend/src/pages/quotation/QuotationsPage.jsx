import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { quotationsService } from '../../services/quotations.service';
import { Loader2, ClipboardList, CheckCircle2, ChevronRight, Eye, FileSpreadsheet, PlusCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function QuotationsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await quotationsService.getRfqs();
        setRfqs(data || []);
      } catch (err) {
        console.error('Failed to load RFQs list', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'PENDING_APPROVAL':
        return 'warning';
      case 'CLOSED':
        return 'neutral';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Open for Bids';
      case 'PENDING_APPROVAL':
        return 'Pending Selection Approval';
      default:
        return status;
    }
  };

  const isSupplier = user?.role === 'SUPPLIER';
  const isBuyer = user?.role === 'BUYER';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Quotations Ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Quotations Log</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            {isSupplier
              ? 'Review open RFQs and respond with quotation pricing proposal sheets.'
              : 'Compare corporate quotations, select vendor partners, and trigger approval requisitions.'}
          </p>
        </div>
      </div>

      {rfqs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
          <ClipboardList className="h-10 w-10 mx-auto text-slate-350" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">No Open Procurement RFQs Found</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              There are currently no active request for quotations published in the system.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map((rfq) => {
            const rfqNumber = `RFQ-${new Date(rfq.createdAt).getFullYear()}-${rfq.title.charCodeAt(0) || 101}`;
            const bidCount = rfq.quotations?.filter((q) => q.status === 'SUBMITTED' || q.status === 'ACCEPTED').length || 0;
            const draftCount = rfq.quotations?.filter((q) => q.status === 'DRAFT').length || 0;

            // Determine if current supplier already submitted or has a draft
            let bidStatusBadge = null;
            if (isSupplier) {
              // Check if there's a quotation belonging to this supplier's vendor ID
              const myQuote = rfq.quotations?.find((q) => q.vendorId === user?.vendorId);
              if (myQuote) {
                bidStatusBadge = (
                  <Badge variant={myQuote.status === 'SUBMITTED' ? 'success' : 'info'}>
                    My Bid: {myQuote.status}
                  </Badge>
                );
              } else {
                bidStatusBadge = (
                  <Badge variant="neutral">Not Bidded</Badge>
                );
              }
            }

            return (
              <div
                key={rfq.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* RFQ Meta Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-slate-400 tracking-wider">{rfqNumber}</span>
                    <Badge variant={getStatusVariant(rfq.status)}>
                      {getStatusLabel(rfq.status)}
                    </Badge>
                    {bidStatusBadge}
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{rfq.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span>Category: <strong className="text-slate-700">{rfq.category}</strong></span>
                    <span>Deadline: <strong className="text-slate-700">{new Date(rfq.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                  </div>
                </div>

                {/* Status/Analytics and Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 shrink-0 justify-between">
                  {/* Counts metrics */}
                  {!isSupplier && (
                    <div className="text-right text-xs shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Responses</span>
                      <strong className="text-slate-800 text-sm font-black">{bidCount} Submitted</strong>
                      {draftCount > 0 && <span className="text-[10px] text-slate-400 block font-medium">({draftCount} draft)</span>}
                    </div>
                  )}

                  {/* Trigger CTA buttons */}
                  <div className="shrink-0">
                    {isSupplier && (
                      <button
                        type="button"
                        onClick={() => navigate(`/vendor/quotation/${rfq.id}`)}
                        className="w-full sm:w-auto py-2 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Submit Quote
                      </button>
                    )}
                    {isBuyer && (
                      <button
                        type="button"
                        onClick={() => navigate(`/procurement/comparison/${rfq.id}`)}
                        className={`w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          bidCount > 0
                            ? 'bg-[#714B67] hover:bg-[#583b51] text-white border-transparent shadow-xs'
                            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        Compare & Select ({bidCount})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
