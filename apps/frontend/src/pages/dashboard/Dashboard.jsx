import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FileText, Users, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const stats = [
    { name: 'Active RFQs', value: '12', icon: FileText, change: '+2 this week', changeType: 'positive' },
    { name: 'Approved Vendors', value: '48', icon: Users, change: '+4 this month', changeType: 'positive' },
    { name: 'Pending Quotations', value: '24', icon: ClipboardList, change: '-3 from yesterday', changeType: 'neutral' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
        <p className="text-sm text-slate-400">Here is an overview of the VendorBridge operations today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-brand-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 truncate">{item.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                </div>
                <div className="p-3 bg-brand-600/10 rounded-lg group-hover:bg-brand-600/20 transition-colors">
                  <Icon className="h-6 w-6 text-brand-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-slate-500">{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h3 className="font-semibold text-lg text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'RFQ-2026-004 published', time: '2 hours ago', user: 'Procurement team' },
            { action: 'New Quotation submitted for RFQ-2026-002', time: '4 hours ago', user: 'Global Logistics Corp' },
            { action: 'Vendor profile approved', time: '1 day ago', user: 'System Admin' },
          ].map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-slate-200 font-medium">{activity.action}</p>
                <p className="text-xs text-slate-500">{activity.user}</p>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
