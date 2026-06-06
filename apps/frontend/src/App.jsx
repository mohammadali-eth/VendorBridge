import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';

// Scaffolded placeholder pages based on project requirements
const VendorsPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">Vendors Registry</h2>
    <p className="text-slate-500 text-sm">Review, verify, and register corporate vendors in the ecosystem.</p>
  </div>
);

const RfqPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">Requests for Quotation (RFQs)</h2>
    <p className="text-slate-500 text-sm">Publish and manage procurement RFQs for verified vendors.</p>
  </div>
);

const QuotationsPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">Quotations Log</h2>
    <p className="text-slate-500 text-sm">Analyze quotations submitted by vendors in response to open RFQs.</p>
  </div>
);

const PurchaseOrdersPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">Purchase Orders</h2>
    <p className="text-slate-500 text-sm">Issue and track purchase orders generated from accepted quotations.</p>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">System Settings</h2>
    <p className="text-slate-500 text-sm">Configure authentication, notifications, and profile details.</p>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-[#111827] px-4">
    <div className="max-w-md w-full text-center space-y-4 bg-white p-8 border border-[#E5E7EB] rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-[#DC2626]">Access Denied</h2>
      <p className="text-slate-500 text-sm">You do not have the required permissions to view this resource.</p>
      <Link
        to="/dashboard"
        className="inline-block py-2 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
      >
        Return to Dashboard
      </Link>
    </div>
  </div>
);

export default function App() {
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    refreshSession().catch(() => {
      // Ignore initial session refresh failures (anonymous user)
    });
  }, [refreshSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-[#111827]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Initializing Portal...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Restricted Route: Only Admin & Procurement Manager */}
            <Route element={<RoleRoute allowedRoles={['ADMIN', 'PROCUREMENT_MANAGER']} />}>
              <Route path="/vendors" element={<VendorsPlaceholder />} />
            </Route>

            <Route path="/rfq" element={<RfqPlaceholder />} />
            <Route path="/quotations" element={<QuotationsPlaceholder />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPlaceholder />} />
            <Route path="/settings" element={<SettingsPlaceholder />} />
          </Route>
        </Route>

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
