import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Send, Save } from 'lucide-react';
import { rfqSchema } from '../../validations/rfq.schema';
import { rfqService } from '../../services/rfq.service';
import RFQForm from '../../components/rfq/RFQForm';
import AttachmentUploader from '../../components/rfq/AttachmentUploader';

export default function CreateRFQ() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPublishMode, setIsPublishMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const methods = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Furniture',
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      items: [
        {
          name: '',
          quantity: 1,
          unit: 'NOS',
        },
      ],
      attachments: [],
      assignedVendorIds: [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        status: isPublishMode ? 'PUBLISHED' : 'DRAFT',
      };
      await rfqService.createRfq(payload);
      showToast(
        isPublishMode
          ? 'RFQ published and shared with assigned vendors successfully!'
          : 'RFQ draft saved successfully!'
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to save RFQ. Please check validation requirements.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white animate-bounce ${
            toast.type === 'success' ? 'bg-[#714B67]' : 'bg-rose-600'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header section matching mockup */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <h2 className="text-2xl font-black text-[#111827] tracking-tight">Create RFQs</h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">new request for quotation</p>
      </div>

      {/* Stepper bar */}
      <div className="flex items-center gap-2 max-w-xl">
        <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-[#714B67] bg-[#714B67] text-white font-black text-xs">
          1
        </div>
        <div className="flex-1 h-[2px] bg-[#714B67]"></div>
        <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-slate-300 text-slate-400 font-bold text-xs bg-white">
          2
        </div>
        <div className="flex-1 h-[2px] bg-slate-200"></div>
        <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-slate-300 text-slate-400 font-bold text-xs bg-white">
          3
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Top Form: Left inputs, Right lists */}
          <RFQForm />

          {/* Divider line */}
          <hr className="border-slate-200" />

          {/* Bottom section: Left stacked buttons, Right attachments box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Left stacked buttons */}
            <div className="flex flex-col gap-3 max-w-xs">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsPublishMode(true);
                  methods.handleSubmit(onSubmit)();
                }}
                className="w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#583b51] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {loading && isPublishMode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Save & Send to Vendors
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsPublishMode(false);
                  methods.handleSubmit(onSubmit)();
                }}
                className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {loading && !isPublishMode ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <Save className="h-4 w-4 text-slate-400" />
                )}
                Save as Draft
              </button>
            </div>

            {/* Right Attachments */}
            <div>
              <AttachmentUploader />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
