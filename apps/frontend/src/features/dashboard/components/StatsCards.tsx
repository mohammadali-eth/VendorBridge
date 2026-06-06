import React from 'react';
import Card from '@/components/common/Card';
import { FileText, CheckSquare, FileSpreadsheet, AlertCircle, Users } from 'lucide-react';
import { KpiCardData } from '../types/dashboard.types';
import { usePermissions } from '@/hooks/usePermissions';

interface StatsCardsProps {
  stats?: KpiCardData;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const { activeRole } = usePermissions();

  const getCards = () => {
    switch (activeRole) {
      case 'procurement_officer':
        return [
          {
            title: 'Active RFQs',
            value: stats?.activeRfqs?.value ?? 0,
            subtext: stats?.activeRfqs?.change ?? '0% from last month',
            icon: FileText,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Pending Quotations',
            value: stats?.pendingQuotations?.value ?? 0,
            subtext: stats?.pendingQuotations?.subtext ?? 'Awaiting vendor bids',
            icon: CheckSquare,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            gradientColor: 'from-amber-500 to-amber-300',
          },
          {
            title: 'Purchase Orders',
            value: stats?.poValue?.value ?? '₹0',
            subtext: stats?.poValue?.label ?? 'Issued this month',
            icon: FileSpreadsheet,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Invoices Generated',
            value: stats?.invoicesGenerated?.value ?? 0,
            subtext: stats?.invoicesGenerated?.subtext ?? 'Billed to finance',
            icon: AlertCircle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            gradientColor: 'from-rose-500 to-rose-300',
          },
        ];
      case 'vendor':
        return [
          {
            title: 'Assigned RFQs',
            value: stats?.assignedRfqs?.value ?? 0,
            subtext: stats?.assignedRfqs?.subtext ?? 'New bidding opportunities',
            icon: FileText,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Submitted Quotations',
            value: stats?.submittedQuotations?.value ?? 0,
            subtext: stats?.submittedQuotations?.subtext ?? 'Active bids in review',
            icon: CheckSquare,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            gradientColor: 'from-emerald-500 to-emerald-300',
          },
          {
            title: 'Approved POs',
            value: stats?.approvedPos?.value ?? 0,
            subtext: stats?.approvedPos?.subtext ?? 'Awaiting dispatch/delivery',
            icon: FileSpreadsheet,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Pending Payments',
            value: stats?.pendingPayments?.value ?? '₹0',
            subtext: stats?.pendingPayments?.subtext ?? 'Approved invoice balances',
            icon: AlertCircle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            gradientColor: 'from-rose-500 to-rose-300',
          },
        ];
      case 'manager':
        return [
          {
            title: 'Pending Approvals',
            value: stats?.pendingApprovals?.value ?? 0,
            subtext: stats?.pendingApprovals?.status ?? 'Requires your authorization',
            icon: FileText,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            gradientColor: 'from-amber-500 to-amber-300',
          },
          {
            title: 'Approved Requests',
            value: stats?.approvedRequests?.value ?? 0,
            subtext: stats?.approvedRequests?.subtext ?? 'Processed this quarter',
            icon: CheckSquare,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            gradientColor: 'from-emerald-500 to-emerald-300',
          },
          {
            title: 'Rejected Requests',
            value: stats?.rejectedRequests?.value ?? 0,
            subtext: stats?.rejectedRequests?.subtext ?? 'Sent back for modifications',
            icon: AlertCircle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            gradientColor: 'from-rose-500 to-rose-300',
          },
          {
            title: 'Workflow Status',
            value: stats?.workflowStatus?.value ?? '0%',
            subtext: stats?.workflowStatus?.subtext ?? 'Approval efficiency index',
            icon: FileSpreadsheet,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
        ];
      case 'admin':
        return [
          {
            title: 'Total Users',
            value: stats?.totalUsers?.value ?? 0,
            subtext: stats?.totalUsers?.subtext ?? 'Active system accounts',
            icon: Users,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Total Vendors',
            value: stats?.totalVendors?.value ?? 0,
            subtext: stats?.totalVendors?.subtext ?? 'Registered suppliers',
            icon: Users,
            color: 'text-[#714B67]',
            bgColor: 'bg-[#F5EEF4]',
            gradientColor: 'from-[#714B67] to-[#A87D9F]',
          },
          {
            title: 'Procurement Spend',
            value: stats?.procurementSpend?.value ?? '₹0',
            subtext: stats?.procurementSpend?.subtext ?? 'Cumulative purchase value',
            icon: FileSpreadsheet,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            gradientColor: 'from-emerald-500 to-emerald-300',
          },
          {
            title: 'Analytics Summary',
            value: stats?.analyticsSummary?.value ?? '0%',
            subtext: stats?.analyticsSummary?.subtext ?? 'SLA delivery index',
            icon: AlertCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            gradientColor: 'from-blue-500 to-blue-300',
          },
        ];
      default:
        return [];
    }
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          gradientTop
          gradientColor={card.gradientColor}
          loading={loading}
          hoverLift={false}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h4 className="mt-1.5 text-2xl font-black text-[#111827] tracking-tight">
                {card.value}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500 flex items-center">
                {card.title === 'Overdue Invoices' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                )}
                {card.title === 'Pending Approvals' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                )}
                {card.subtext}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${card.bgColor} ${card.color} flex-shrink-0 border border-slate-100/60`}>
              <card.icon size={20} className="stroke-[2.5]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
