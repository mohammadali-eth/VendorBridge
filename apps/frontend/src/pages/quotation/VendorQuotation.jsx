import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Send, Save } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { quotationsService } from '../../services/quotations.service';
import { rfqService } from '../../services/rfq.service';
import { quotationSchema } from '../../validations/quotation.schema';
import RFQSummaryCard from '../../components/quotation/RFQSummaryCard';
import QuotationItemTable from '../../components/quotation/QuotationItemTable';
import PricingSummaryCard from '../../components/quotation/PricingSummaryCard';
import DeliveryInput from '../../components/quotation/DeliveryInput';
import NotesTextarea from '../../components/quotation/NotesTextarea';

export default function VendorQuotation() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [rfq, setRfq] = useState(null);
  const [loadingRfq, setLoadingRfq] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitMode, setIsSubmitMode] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const methods = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      rfqId: rfqId,
      vendorId: '',
      items: [],
      deliveryDays: 7,
      gstPercent: 18,
      otherTaxPercent: 0,
      notes: '',
      subtotal: 0,
      grandTotal: 0,
    },
  });

  // Resolve Vendor ID and Fetch RFQ
  useEffect(() => {
    async function initPage() {
      try {
        // 1. Resolve Vendor ID (fallback if user lacks one)
        let finalVendorId = user?.vendorId;
        if (!finalVendorId) {
          const vendorsData = await rfqService.getVendors();
          const firstVendor = vendorsData.vendors?.[0];
          finalVendorId = firstVendor?.id || 'a0000000-0000-0000-0000-000000000001'; // Fallback UUID
        }
        methods.setValue('vendorId', finalVendorId);

        // 2. Fetch RFQ
        const rfqData = await quotationsService.getRfq(rfqId);
        setRfq(rfqData);

        // Populate items with initial values matching RFQ requested quantities
        const rawItems = rfqData?.items;
        const parsedItems = (() => {
          if (!rawItems) return [];
          if (Array.isArray(rawItems)) return rawItems;
          if (typeof rawItems === 'string') {
            try {
              const parsed = JSON.parse(rawItems);
              return Array.isArray(parsed) ? parsed : [];
            } catch (_) {
              return [];
            }
          }
          return [];
        })();

        const initialItems = parsedItems.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity) || 1,
          unit: item.unit || 'NOS',
          description: item.description || '',
          unitPrice: 0,
          total: 0,
          deliveryDays: 7,
        }));

        methods.reset({
          rfqId: rfqId,
          vendorId: finalVendorId,
          items: initialItems,
          deliveryDays: 7,
          gstPercent: 18,
          otherTaxPercent: 3,
          notes: '',
          subtotal: 0,
          grandTotal: 0,
        });
      } catch (err) {
        console.error(err);
        showToast('Failed to load RFQ details', 'error');
      } finally {
        setLoadingRfq(false);
      }
    }

    if (rfqId) {
      initPage();
    }
  }, [rfqId, user, methods]);

  const handleFormSubmit = async (data) => {
    // Requirements validation: At least one item must contain pricing
    const hasPricing = data.items.some((item) => Number(item.unitPrice) > 0);
    if (!hasPricing) {
      showToast('At least one item must contain a pricing quote before submission', 'error');
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        ...data,
        status: isSubmitMode ? 'SUBMITTED' : 'DRAFT',
      };
      await quotationsService.createQuotation(payload);
      showToast(
        isSubmitMode ? 'Quotation submitted successfully!' : 'Quotation draft saved successfully!'
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit quotation';
      showToast(msg, 'error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingRfq) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading RFQ specifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* Toast Notice */}
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
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-black text-[#111827] tracking-tight">Submit Quotation</h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Respond to open procurement requests and submit your best bid.
        </p>
      </div>

      {/* RFQ General Card */}
      <RFQSummaryCard rfq={rfq} />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Items table */}
            <QuotationItemTable />

            <hr className="border-slate-100" />

            {/* Delivery Inputs */}
            <DeliveryInput />

            <hr className="border-slate-100" />

            {/* Notes Comments */}
            <NotesTextarea />
          </div>

          {/* Pricing summary & actions column */}
          <div className="lg:col-span-1 space-y-4">
            <PricingSummaryCard />

            <div className="space-y-3">
              <button
                type="button"
                disabled={loadingSubmit}
                onClick={() => {
                  setIsSubmitMode(true);
                  methods.handleSubmit(handleFormSubmit)();
                }}
                className="w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#583b51] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {loadingSubmit && isSubmitMode ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Quotation
              </button>

              <button
                type="button"
                disabled={loadingSubmit}
                onClick={() => {
                  setIsSubmitMode(false);
                  methods.handleSubmit(handleFormSubmit)();
                }}
                className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {loadingSubmit && !isSubmitMode ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-400" />
                ) : (
                  <Save className="h-4 w-4 text-slate-400" />
                )}
                Save Draft
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
