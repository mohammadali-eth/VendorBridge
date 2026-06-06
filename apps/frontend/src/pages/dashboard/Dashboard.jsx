import { useAuthStore } from '../../store/auth.store';
import { FileText, Users, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'BUYER':
        return 'Buyer Agent';
      case 'SUPPLIER':
        return 'Supplier Partner';
      case 'PROCUREMENT_MANAGER':
        return 'Procurement Manager';
      default:
        return 'Portal User';
    }
  };

  const getStats = (role) => {
    const defaultStats = [
      { name: 'Active RFQs', value: '12', icon: FileText, change: '+2 this week' },
      { name: 'Approved Vendors', value: '48', icon: Users, change: '+4 this month' },
      { name: 'Pending Quotations', value: '24', icon: ClipboardList, change: '-3 from yesterday' },
    ];

    if (role === 'SUPPLIER') {
      return [
        { name: 'Open RFQs Available', value: '8', icon: FileText, change: '3 expiring soon' },
        { name: 'My Submitted Quotes', value: '14', icon: ClipboardList, change: '+2 pending decision' },
        { name: 'Accepted Purchase Orders', value: '5', icon: Users, change: 'All active' },
      ];
    }

    return defaultStats;
  };

  const stats = getStats(user?.role);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Authorized Role: <span className="font-semibold text-[#714B67]">{getRoleLabel(user?.role)}</span> | 
          Reviewing your VendorBridge operations console.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative overflow-hidden bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#714B67]/30 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.name}</p>
                  <p className="mt-2 text-3xl font-bold text-[#111827]">{item.value}</p>
                </div>
                <div className="p-3 bg-[#F5EEF4] rounded-xl border border-[#A87D9F]/10">
                  <Icon className="h-5 w-5 text-[#714B67]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-base text-[#111827] mb-4">Platform Updates</h3>
        <div className="space-y-4">
          {[
            { action: 'RFQ-2026-004 published for logistics services', time: '2 hours ago', user: 'Procurement team' },
            { action: 'New Quotation submitted for RFQ-2026-002', time: '4 hours ago', user: 'Global Logistics Corp' },
            { action: 'Supplier registration status verified', time: '1 day ago', user: 'System Admin' },
          ].map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm border-b border-[#E5E7EB] pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-[#111827] font-semibold">{activity.action}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.user}</p>
              </div>
              <span className="text-xs text-slate-400 font-medium">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
