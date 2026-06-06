import { useState, useCallback } from 'react';
import approvalService from '../services/approvalService';

export default function useApproval() {
  const [approvalData, setApprovalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovalDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await approvalService.getApproval(id);
      setApprovalData(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load approval details');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id, comment) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await approvalService.approve(id, comment);
      await fetchApprovalDetails(id);
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to approve request';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id, comment) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await approvalService.reject(id, comment);
      await fetchApprovalDetails(id);
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject request';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBack = async (id, comment) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await approvalService.sendBack(id, comment);
      await fetchApprovalDetails(id);
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send back request';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRemarks = async (id, remarks, internalNotes) => {
    try {
      const updated = await approvalService.updateRemarks(id, remarks, internalNotes);
      setApprovalData((prev) => prev ? { ...prev, remarks, internalNotes } : null);
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    approvalData,
    loading,
    error,
    fetchApprovalDetails,
    handleApprove,
    handleReject,
    handleSendBack,
    handleSaveRemarks,
  };
}
