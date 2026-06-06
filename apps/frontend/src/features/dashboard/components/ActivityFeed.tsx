import React from 'react';
import Card from '@/components/common/Card';
import { Activity } from '../types/dashboard.types';
import { User, Plus, Award, Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  activities?: Activity[];
  loading: boolean;
}

export default function ActivityFeed({
  activities = [],
  loading,
}: ActivityFeedProps) {
  const getActivityIcon = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('vendor')) return { icon: User, color: 'text-[#714B67] bg-[#F5EEF4]' };
    if (d.includes('approved') || d.includes('status')) return { icon: Award, color: 'text-[#16A34A] bg-emerald-50' };
    if (d.includes('created') || d.includes('rfq')) return { icon: Plus, color: 'text-[#714B67] bg-[#F5EEF4]' };
    return { icon: Sparkles, color: 'text-slate-600 bg-slate-50' };
  };

  return (
    <Card
      title="Activity Feed"
      subtitle="Real-time audit log of system operations."
      bodyClassName="pr-4 overflow-hidden"
      hoverLift={false}
    >
      {loading ? (
        <div className="animate-pulse space-y-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="rounded-full bg-slate-200 h-8 w-8"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((item, itemIdx) => {
              const meta = getActivityIcon(item.activity);
              return (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {itemIdx !== activities.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-100"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3.5">
                      <div>
                        <span
                          className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-100 ${meta.color}`}
                        >
                          <meta.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-xs font-semibold text-slate-800 leading-4">
                          <span className="font-bold text-slate-900 mr-1">
                            {item.user}
                          </span>
                          {item.activity}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
