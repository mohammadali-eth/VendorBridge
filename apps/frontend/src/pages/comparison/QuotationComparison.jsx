import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Award, Zap, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { quotationsService } from '../../services/quotations.service';
import ComparisonTable from '../../components/comparison/ComparisonTable';
import ComparisonFilters from '../../components/comparison/ComparisonFilters';
import VendorSelectionModal from '../../components/comparison/VendorSelectionModal';

export default function QuotationComparison() {
  const { rfqId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Contains rfqTitle, rfqNumber, quotations array
  const [toast, setToast] = useState(null);

  // Filter & Sort State
  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState(1000000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [maxDelivery, setMaxDelivery] = useState(30);

  // Selection Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [submittingSelection, setSubmittingSelection] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Data
  const loadData = useCallback(async () => {
    try {
      const result = await quotationsService.getComparison(rfqId);
      setData(result);

      // Set upper budget slider boundary dynamically
      if (result.quotations && result.quotations.length > 0) {
        const maxPrice = Math.max(...result.quotations.map((q) => q.grandTotal));
        const roundedMax = Math.ceil(maxPrice / 10000) * 10000 + 10000;
        setMaxPriceLimit(roundedMax);
        setPriceRange(roundedMax);
      }
    } catch (err) {
      showToast('Failed to load comparison data', 'error');
    } finally {
      setLoading(false);
    }
  }, [rfqId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Apply filters and sorting
  const filteredQuotes = useMemo(() => {
    if (!data?.quotations) return [];

    let quotes = [...data.quotations];

    // Filters
    quotes = quotes.filter(
      (q) =>
        q.grandTotal <= priceRange &&
        q.vendorRating >= minRating &&
        q.deliveryDays <= maxDelivery
    );

    // Sorting
    quotes.sort((a, b) => {
      if (sortBy === 'price') {
        return a.grandTotal - b.grandTotal;
      }
      if (sortBy === 'rating') {
        return b.vendorRating - a.vendorRating;
      }
      if (sortBy === 'delivery') {
        return a.deliveryDays - b.deliveryDays;
      }
      return 0;
    });

    return quotes;
  }, [data, sortBy, priceRange, minRating, maxDelivery]);

  // Calculate Summary metrics
  const getSummary = () => {
    if (!data?.quotations || data.quotations.length === 0) return null;

    const all = data.quotations;

    // Lowest Cost
    const lowest = [...all].sort((a, b) => a.grandTotal - b.grandTotal)[0];

    // Fastest Delivery
    const fastest = [...all].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

    // Highest Rated
    const highestRated = [...all].sort((a, b) => b.vendorRating - a.vendorRating)[0];

    // Recommended Vendor Scoring Algorithm:
    // score = (priceScore * 0.5) + (deliveryScore * 0.25) + (ratingScore * 0.25)
    const prices = all.map((q) => q.grandTotal);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const deliveries = all.map((q) => q.deliveryDays);
    const minDelivery = Math.min(...deliveries);
    const maxDeliveryVal = Math.max(...deliveries);

    const scoredQuotations = all.map((q) => {
      // Normalize price (lower is better, if all same priceScore = 1.0)
      const priceScore =
        maxPrice === minPrice ? 1.0 : (maxPrice - q.grandTotal) / (maxPrice - minPrice);

      // Normalize delivery (lower is better)
      const deliveryScore =
        maxDeliveryVal === minDelivery
          ? 1.0
          : (maxDeliveryVal - q.deliveryDays) / (maxDeliveryVal - minDelivery);

      // Normalize rating (higher is better)
      const ratingScore = q.vendorRating / 5.0;

      const score = priceScore * 0.5 + deliveryScore * 0.25 + ratingScore * 0.25;

      return { ...q, score };
    });

    const recommended = [...scoredQuotations].sort((a, b) => b.score - a.score)[0];

    return {
      lowest,
      fastest,
      highestRated,
      recommended,
    };
  };

  const summary = getSummary();

  const handleSelectVendorTrigger = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = async () => {
    setSubmittingSelection(true);
    try {
      const selection = await quotationsService.selectVendor({
        rfqId,
        vendorId: selectedQuote.vendorId,
        quotationId: selectedQuote.id,
      });

      showToast('Vendor selected successfully! RFQ moved to Pending Approval.', 'success');
      setIsModalOpen(false);
      setTimeout(() => {
        navigate(`/approvals/${selection.id}`);
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to select vendor';
      showToast(msg, 'error');
    } finally {
      setSubmittingSelection(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading quotation comparison reports...</span>
      </div>
    );
  }

  const quotationsCount = data?.quotations?.length || 0;

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white animate-bounce ${
            toast.type === 'success' ? 'bg-[#714B67]' : 'bg-rose-600'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#111827] tracking-tight">Quotation Comparison</h2>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              {data?.rfqTitle} ({data?.rfqNumber})
            </p>
          </div>
          <span className="shrink-0 px-3 py-1.5 bg-[#F5EEF4] border border-[#714B67]/20 text-[#714B67] rounded-xl text-xs font-bold uppercase tracking-wider">
            {quotationsCount} Quotations Received
          </span>
        </div>
      </div>

      {/* Columns Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left main comparison grid */}
        <div className="lg:col-span-3 space-y-6">
          <ComparisonTable
            quotations={filteredQuotes}
            onSelectVendor={handleSelectVendorTrigger}
          />
        </div>

        {/* Right sidebar column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary Panel */}
          {summary && (
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 shadow-xl text-white space-y-5">
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400">Comparison Summary</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Key procurement quotation milestones.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Lowest Cost */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg mt-0.5">
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lowest Cost Vendor</span>
                    <span className="font-bold text-slate-200 block truncate max-w-[150px]">{summary.lowest.vendorName}</span>
                    <span className="text-[10px] font-bold text-[#A87D9F]">
                      ₹{summary.lowest.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Fastest Delivery */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-blue-950 text-blue-400 rounded-lg mt-0.5">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Fastest Delivery</span>
                    <span className="font-bold text-slate-200 block truncate max-w-[150px]">{summary.fastest.vendorName}</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{summary.fastest.deliveryDays} Days</span>
                  </div>
                </div>

                {/* Highest Rated */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-amber-950 text-amber-400 rounded-lg mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Highest Rated Vendor</span>
                    <span className="font-bold text-slate-200 block truncate max-w-[150px]">{summary.highestRated.vendorName}</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{summary.highestRated.vendorRating} / 5</span>
                  </div>
                </div>

                {/* Recommended Vendor */}
                <div className="border-t border-slate-800 my-2 pt-3.5" />

                <div className="p-3 bg-gradient-to-r from-[#714B67]/40 to-slate-850 rounded-2xl border border-[#714B67]/30 space-y-1.5 relative overflow-hidden">
                  <div className="absolute right-1.5 top-1.5 opacity-20 text-[#A87D9F]">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-[#A87D9F]" />
                    <span className="text-[9px] font-bold text-[#A87D9F] uppercase tracking-wider">Recommended choice</span>
                  </div>
                  <div>
                    <span className="font-black text-slate-100 block truncate max-w-[140px]">
                      {summary.recommended.vendorName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      Balanced cost, rating, & speed.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Panel */}
          <ComparisonFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            maxDelivery={maxDelivery}
            setMaxDelivery={setMaxDelivery}
            maxPriceLimit={maxPriceLimit}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <VendorSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSelection}
        selectedVendor={selectedQuote}
        loading={submittingSelection}
      />
    </div>
  );
}
