import React from 'react';
import Card from '../common/Card';
import { FileText, ShieldAlert, Receipt, ShieldCheck } from 'lucide-react';

export default function NotificationSummaryCards({ timeline = [], notifications = [] }) {
  const rfqLogs = timeline.filter((l) => l.module === 'RFQ');
  const approvalLogs = timeline.filter((l) => l.module === 'Approval');
  const invoiceLogs = timeline.filter((l) => l.module === 'Invoice' || l.module === 'PO');
  const totalLogs = timeline.length;

  const cards = [
    {
      title: 'RFQ Notifications',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      metric1: { label: 'Total RFQ Updates', value: rfqLogs.length },
      metric2: { label: 'New RFQs Today', value: rfqLogs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length },
    },
    {
      title: 'Approval Alerts',
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50',
      metric1: { label: 'Pending Approvals', value: notifications.filter(n => n.title.includes('Approval') && !n.read).length },
      metric2: { label: 'Rejected Requests', value: timeline.filter(l => l.action.toLowerCase().includes('reject')).length },
    },
    {
      title: 'Invoice Updates',
      icon: Receipt,
      color: 'text-emerald-600 bg-emerald-50',
      metric1: { label: 'Total Receipts', value: invoiceLogs.length },
      metric2: { label: 'Recent payments', value: timeline.filter(l => l.action.toLowerCase().includes('paid')).length },
    },
    {
      title: 'Audit Events',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50',
      metric1: { label: 'Total Logs', value: totalLogs },
      metric2: { label: "Today's Activities", value: timeline.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="flex flex-col justify-between p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <Icon size={16} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-tight">{card.metric1.label}</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{card.metric1.value}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-tight">{card.metric2.label}</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{card.metric2.value}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
