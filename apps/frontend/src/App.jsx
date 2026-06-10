import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import VendorPage from './pages/vendors/VendorPage';
import CreateRFQ from './pages/rfq/CreateRFQ';
import VendorQuotation from './pages/quotation/VendorQuotation';
import QuotationComparison from './pages/comparison/QuotationComparison';
import QuotationsPage from './pages/quotation/QuotationsPage';
import ApprovalWorkflowPage from './pages/approvals/ApprovalWorkflowPage';
import ApprovalsInboxPage from './pages/approvals/ApprovalsInboxPage';
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import PurchaseOrderDetailPage from './pages/purchase-orders/PurchaseOrderDetailPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';
import ActivityLogsPage from './pages/activity/ActivityLogsPage';
import ReportsPage from './pages/reports/ReportsPage';
import UserManagement from './pages/settings/UserManagement';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const SettingsPlaceholder = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
    <h2 className="text-xl font-bold text-[#111827] mb-2">System Settings</h2>
    <p className="text-slate-500 text-sm">Configure authentication, notifications, and profile details.</p>
  </div>
);

import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center font-sans">
    <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
        <ShieldAlert size={28} />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-xl font-black text-[#111827] tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          You do not have permission to access this page.
        </p>
      </div>

      <Link
        to="/dashboard"
        className="block w-full py-2.5 px-4 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
      >
        Back to Dashboard
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
    <QueryClientProvider client={queryClient}>
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
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Procurement Officer Only */}
              <Route element={<RoleRoute allowedRoles={['procurement_officer']} />}>
                <Route path="/procurement/comparison/:rfqId" element={<QuotationComparison />} />
              </Route>

              {/* Vendor Only */}
              <Route element={<RoleRoute allowedRoles={['vendor']} />}>
                <Route path="/vendor/quotation/:rfqId" element={<VendorQuotation />} />
                <Route path="/quotations" element={<QuotationsPage />} />
              </Route>

              {/* Manager Only */}
              <Route element={<RoleRoute allowedRoles={['manager']} />}>
                <Route path="/approvals" element={<ApprovalsInboxPage />} />
                <Route path="/approvals/:approvalId" element={<ApprovalWorkflowPage />} />
              </Route>

              {/* Admin Only */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={<UserManagement />} />
              </Route>

              {/* Admin & Procurement Officer */}
              <Route element={<RoleRoute allowedRoles={['admin', 'procurement_officer']} />}>
                <Route path="/vendors" element={<VendorPage />} />
                <Route path="/settings" element={<SettingsPlaceholder />} />
              </Route>

              {/* Procurement Officer & Vendor */}
              <Route element={<RoleRoute allowedRoles={['procurement_officer', 'vendor']} />}>
                <Route path="/rfq" element={<CreateRFQ />} />
                <Route path="/rfqs" element={<CreateRFQ />} />
              </Route>

              {/* Procurement Officer, Vendor, Manager */}
              <Route element={<RoleRoute allowedRoles={['procurement_officer', 'vendor', 'manager']} />}>
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="/purchase-orders/:poId" element={<PurchaseOrderDetailPage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
              </Route>

              {/* All Roles */}
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
            </Route>
          </Route>

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
