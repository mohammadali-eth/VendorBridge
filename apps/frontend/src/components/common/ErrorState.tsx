import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Failed to load data. Please verify your connection.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-dashed border-rose-200">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 mb-1">
        Data Connection Error
      </h3>
      <p className="text-xs text-rose-600 max-w-sm mb-4 leading-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors gap-1.5 cursor-pointer"
        >
          <RotateCcw size={14} />
          Retry Connection
        </button>
      )}
    </div>
  );
}
