import React from 'react';
import Card from '@/components/common/Card';
import { 
  FileText, 
  Users, 
  FileSpreadsheet, 
  CheckSquare, 
  ClipboardList, 
  History, 
  BarChart3 
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const { activeRole } = usePermissions();
  const navigate = useNavigate();

  const getActions = () => {
    switch (activeRole) {
      case 'procurement_officer':
        return [
          {
            label: 'Create RFQ',
            icon: FileText,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/rfq'),
          },
          {
            label: 'Compare Quotations',
            icon: ClipboardList,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/quotations'),
          },
          {
            label: 'Generate PO',
            icon: FileSpreadsheet,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/purchase-orders'),
          },
        ];
      case 'vendor':
        return [
          {
            label: 'Submit Quotation',
            icon: FileText,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/rfq'),
          },
          {
            label: 'Track RFQ',
            icon: ClipboardList,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/quotations'),
          },
          {
            label: 'View Purchase Orders',
            icon: FileSpreadsheet,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/purchase-orders'),
          },
        ];
      case 'manager':
        return [
          {
            label: 'Review Requests',
            icon: CheckSquare,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/approvals'),
          },
          {
            label: 'Approve Workflow',
            icon: CheckSquare,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/approvals'),
          },
          {
            label: 'View Audit Trail',
            icon: History,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/activity-logs'),
          },
        ];
      case 'admin':
        return [
          {
            label: 'Manage Users',
            icon: Users,
            color: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20 hover:bg-[#F5EEF4]/80',
            iconBg: 'bg-[#714B67]/10 text-[#714B67]',
            onClick: () => navigate('/settings'),
          },
          {
            label: 'Manage Vendors',
            icon: Users,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/vendors'),
          },
          {
            label: 'View Reports',
            icon: BarChart3,
            color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
            iconBg: 'bg-slate-500/10 text-slate-600',
            onClick: () => navigate('/reports'),
          },
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <Card
      title="Quick Actions"
      subtitle="Instantly create or review procurement workflows."
      hoverLift={false}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={act.onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border font-bold text-xs gap-3 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714B67] ${act.color}`}
          >
            <div className={`p-2.5 rounded-lg ${act.iconBg}`}>
              <act.icon size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-center">{act.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
