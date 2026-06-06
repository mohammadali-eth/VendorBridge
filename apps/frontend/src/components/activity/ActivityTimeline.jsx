import React from 'react';
import ActivityItem from './ActivityItem';
import { HelpCircle } from 'lucide-react';

export default function ActivityTimeline({ timeline = [] }) {
  if (timeline.length === 0) {
    return (
      <div className="py-12 text-center text-slate-450 space-y-2">
        <HelpCircle className="h-8 w-8 mx-auto text-slate-300 animate-pulse" />
        <p className="text-xs font-bold">No timeline items match this category.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l border-slate-100 ml-2 mt-4 space-y-1">
      {timeline.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </div>
  );
}
