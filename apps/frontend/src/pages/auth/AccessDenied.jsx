import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-[#111827] tracking-tight">Access Denied</h1>
          <p className="text-sm text-slate-500 font-medium">
            You do not have permission to access this page.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
