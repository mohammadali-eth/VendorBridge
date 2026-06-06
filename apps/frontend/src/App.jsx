import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './routes';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

// Scaffolded placeholder pages based on project requirements
const VendorsPlaceholder = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
    <h2 className="text-xl font-bold text-white mb-2">Vendors Registry</h2>
    <p className="text-slate-400 text-sm">Review, verify, and register corporate vendors in the ecosystem.</p>
  </div>
);

const RfqPlaceholder = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
    <h2 className="text-xl font-bold text-white mb-2">Requests for Quotation (RFQs)</h2>
    <p className="text-slate-400 text-sm">Publish and manage procurement RFQs for verified vendors.</p>
  </div>
);

const QuotationsPlaceholder = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
    <h2 className="text-xl font-bold text-white mb-2">Quotations Log</h2>
    <p className="text-slate-400 text-sm">Analyze quotations submitted by vendors in response to open RFQs.</p>
  </div>
);

const PurchaseOrdersPlaceholder = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
    <h2 className="text-xl font-bold text-white mb-2">Purchase Orders</h2>
    <p className="text-slate-400 text-sm">Issue and track purchase orders generated from accepted quotations.</p>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
    <h2 className="text-xl font-bold text-white mb-2">System Settings</h2>
    <p className="text-slate-400 text-sm">Configure authentication, notifications, and profile details.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vendors" element={<VendorsPlaceholder />} />
              <Route path="/rfq" element={<RfqPlaceholder />} />
              <Route path="/quotations" element={<QuotationsPlaceholder />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPlaceholder />} />
              <Route path="/settings" element={<SettingsPlaceholder />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
