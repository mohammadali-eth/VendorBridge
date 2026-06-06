import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EEF4] border border-[#A87D9F]/20">
            <Shield className="h-6 w-6 text-[#714B67]" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold text-[#111827] tracking-tight">
            VendorBridge
          </h2>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-[#A87D9F]">
            Enterprise Supplier & RFQ Portal
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
