import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import {
  useDashboardStats,
  useDashboardRecentPOs,
  useDashboardRecentInvoices,
  useDashboardActivities,
  useDashboardAnalytics,
} from '../../features/dashboard/hooks/useDashboard';
import StatsCards from '../../features/dashboard/components/StatsCards';
import RecentPOs from '../../features/dashboard/components/RecentPOs';
import RecentInvoices from '../../features/dashboard/components/RecentInvoices';
import QuickActions from '../../features/dashboard/components/QuickActions';
import ApprovalQueue from '../../features/dashboard/components/ApprovalQueue';
import ActivityFeed from '../../features/dashboard/components/ActivityFeed';
import AnalyticsCharts from '../../features/dashboard/components/AnalyticsCharts';
import ErrorState from '../../components/common/ErrorState';

export default function Dashboard() {
  const { user } = useAuthStore();

  // Load Dashboard server states
  const statsQuery = useDashboardStats();
  const posQuery = useDashboardRecentPOs();
  const invoicesQuery = useDashboardRecentInvoices();
  const activitiesQuery = useDashboardActivities();
  const analyticsQuery = useDashboardAnalytics();

  const isError =
    statsQuery.isError ||
    posQuery.isError ||
    invoicesQuery.isError ||
    activitiesQuery.isError ||
    analyticsQuery.isError;

  const handleRetry = () => {
    statsQuery.refetch();
    posQuery.refetch();
    invoicesQuery.refetch();
    activitiesQuery.refetch();
    analyticsQuery.refetch();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'System Administrator';
      case 'PROCUREMENT_MANAGER':
        return 'Procurement Manager';
      case 'BUYER':
        return 'Buyer Agent';
      case 'SUPPLIER':
        return 'Supplier Partner';
      default:
        return 'Portal User';
    }
  };

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <ErrorState
          message="Could not load the procurement command console. The connection to the backend was interrupted."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Info Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Authorized Role:{' '}
            <span className="font-semibold text-[#714B67]">{getRoleLabel(user?.role)}</span> |
            Reviewing your VendorBridge operations command console.
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-[#E5E7EB] shadow-sm text-xs font-semibold text-slate-600">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              System Time
            </span>
            {today}
          </div>
        </div>
      </div>

      {/* 1. KPI Cards Row */}
      <StatsCards stats={statsQuery.data} loading={statsQuery.isLoading} />

      {/* 2. Recharts Analytics Spend Charts (Upper Section) */}
      <AnalyticsCharts
        spendHistory={analyticsQuery.data?.spendHistory}
        spendDistribution={analyticsQuery.data?.spendDistribution}
        loading={analyticsQuery.isLoading}
      />

      {/* 3. Main Operational Grid (Lower Section) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column (2/3 width on desktop): POs & Invoices tables */}
        <div className="lg:col-span-2 space-y-8">
          <RecentPOs pos={posQuery.data} loading={posQuery.isLoading} />

          <RecentInvoices invoices={invoicesQuery.data} loading={invoicesQuery.isLoading} />
        </div>

        {/* Right column (1/3 width on desktop): Quick Actions, Pending Approvals, Activity Feed */}
        <div className="space-y-8">
          <QuickActions />

          <ApprovalQueue
            queue={analyticsQuery.data?.approvalQueue}
            loading={analyticsQuery.isLoading}
          />

          <ActivityFeed activities={activitiesQuery.data} loading={activitiesQuery.isLoading} />
        </div>
      </div>
    </div>
  );
}
