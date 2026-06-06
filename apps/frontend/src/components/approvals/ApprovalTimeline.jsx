import React from 'react';
import Card from '../common/Card';
import { Clock } from 'lucide-react';

export default function ApprovalTimeline({ timeline = [] }) {
  return (
    <Card className="text-left">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Timeline Log</h3>
      </div>

      <div className="relative border-l border-slate-100 ml-2.5 pl-5 space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline node dot */}
            <div className="absolute -left-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#714B67]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-black text-slate-800">{item.action}</span>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold">
                <span>By: {item.user}</span>
                <span>{new Date(item.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              </div>
              {item.remarks && (
                <p className="text-[11px] text-slate-500 italic mt-0.5 leading-snug">
                  "{item.remarks}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
