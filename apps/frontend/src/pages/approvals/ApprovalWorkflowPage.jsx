import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import useApproval from '../../hooks/useApproval';
import WorkflowTracker from '../../components/approvals/WorkflowTracker';
import ApprovalSummaryCard from '../../components/approvals/ApprovalSummaryCard';
import QuotationSnapshotCard from '../../components/approvals/QuotationSnapshotCard';
import ApprovalChain from '../../components/approvals/ApprovalChain';
import ApprovalTimeline from '../../components/approvals/ApprovalTimeline';
import ApprovalStatusCard from '../../components/approvals/ApprovalStatusCard';
import ApprovalRemarks from '../../components/approvals/ApprovalRemarks';
import ApprovalActions from '../../components/approvals/ApprovalActions';
import AuditTrailTable from '../../components/approvals/AuditTrailTable';
import { approvalSchema } from '../../validations/approvalSchema';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ApprovalWorkflowPage() {
  const { approvalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    approvalData,
    loading,
    error,
    fetchApprovalDetails,
    handleApprove,
    handleReject,
    handleSendBack,
    handleSaveRemarks,
  } = useApproval();

  const [remarks, setRemarks] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (approvalId) {
      fetchApprovalDetails(approvalId);
    }
  }, [approvalId, fetchApprovalDetails]);

  // Sync remarks from loaded data
  useEffect(() => {
    if (approvalData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemarks(approvalData.remarks || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalNotes(approvalData.internalNotes || '');
    }
  }, [approvalData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateComment = () => {
    const result = approvalSchema.safeParse({ comment: remarks });
    if (!result.success) {
      setRemarksError(result.error.errors[0].message);
      return false;
    }
    setRemarksError('');
    return true;
  };

  const onApproveClick = async () => {
    try {
      await handleApprove(approvalId, remarks);
      await handleSaveRemarks(approvalId, remarks, internalNotes);
      showToast('Approval submitted successfully!');
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const onRejectClick = async () => {
    if (!validateComment()) return;
    try {
      await handleReject(approvalId, remarks);
      await handleSaveRemarks(approvalId, remarks, internalNotes);
      showToast('Request rejected successfully', 'warning');
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  const onSendBackClick = async () => {
    if (!validateComment()) return;
    try {
      await handleSendBack(approvalId, remarks);
      await handleSaveRemarks(approvalId, remarks, internalNotes);
      showToast('Request sent back for revisions', 'info');
    } catch (err) {
      showToast(err.message || 'Send back failed', 'error');
    }
  };

  if (loading && !approvalData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Approval Process View...</span>
      </div>
    );
  }

  if (error || !approvalData) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Failed to Load Approval Details</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {error || 'The requested approval ID is invalid or has been removed.'}
        </p>
        <button
          onClick={() => navigate('/quotations')}
          className="py-2 px-4 bg-[#714B67] text-white rounded-xl text-xs font-bold"
        >
          Return to Quotations
        </button>
      </div>
    );
  }

  // Authorize Roles
  const isApprover = user?.role === 'PROCUREMENT_MANAGER' || user?.role === 'ADMIN';

  const canTakeAction = isApprover && approvalData.status === 'PENDING';

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2 py-3 px-5 rounded-2xl shadow-xl text-xs font-bold border transition-all text-white ${
            toast.type === 'error'
              ? 'bg-rose-600 border-rose-500'
              : toast.type === 'warning'
                ? 'bg-amber-600 border-amber-500'
                : 'bg-emerald-600 border-emerald-500'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <h2 className="text-2xl font-black text-[#111827] tracking-tight">Approval Workflow</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 font-medium ml-6">
            RFQ: <strong className="text-slate-700">{approvalData.rfqTitle}</strong> &middot;
            Vendor: <strong className="text-slate-700">{approvalData.vendorName}</strong>
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <WorkflowTracker currentLevel={approvalData.currentLevel} status={approvalData.status} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Chain and Remarks */}
        <div className="lg:col-span-2 space-y-6">
          <ApprovalSummaryCard data={approvalData} />

          <ApprovalChain history={approvalData.history} currentLevel={approvalData.currentLevel} />

          {canTakeAction ? (
            <ApprovalRemarks
              remarks={remarks}
              setRemarks={setRemarks}
              internalNotes={internalNotes}
              setInternalNotes={setInternalNotes}
              errors={{ remarks: remarksError }}
            />
          ) : (
            approvalData.remarks && (
              <div className="bg-slate-55 border border-slate-200 rounded-3xl p-5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Final Decision Remarks
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  &quot;{approvalData.remarks}&quot;
                </p>
              </div>
            )
          )}

          {canTakeAction && (
            <ApprovalActions
              onApprove={onApproveClick}
              onReject={onRejectClick}
              onSendBack={onSendBackClick}
              loading={loading}
            />
          )}
        </div>

        {/* Right Column: Snapshots */}
        <div className="space-y-6">
          <QuotationSnapshotCard snapshot={approvalData.snapshot} />
          <ApprovalStatusCard data={approvalData} />
          <ApprovalTimeline timeline={approvalData.timeline} />
        </div>
      </div>

      {/* Audit trail log history */}
      <AuditTrailTable auditLogs={approvalData.auditLogs} />
    </div>
  );
}
