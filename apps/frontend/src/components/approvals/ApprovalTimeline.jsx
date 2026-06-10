import React from 'react';
import Card from '../common/Card';

export default function ApprovalTimeline({ timeline = [] }) {
  return (
    <Card className="text-left">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-black text-slate-800 tracking-tight">Timeline Log</h3>
      </div>

      <div className="relative border-l border-slate-100 ml-2.5 pl-5 space-y-4">
        {timeline.map((item, index) => {
          const actionText = item.action || item.title || 'Action';
          const userText = item.user || item.description || 'System';
          const ts = item.timestamp || item.date;

          const formattedTime = (() => {
            if (!ts) return '';
            const d = new Date(ts);
            return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          })();

          const formattedDate = (() => {
            if (!ts) return '';
            const d = new Date(ts);
            return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          })();

          return (
            <div key={index} className="relative">
              {/* Timeline node dot */}
              <div className="absolute -left-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#714B67]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black text-slate-800">{actionText}</span>
                  {formattedTime && (
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {formattedTime}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold">
                  <span>By: {userText}</span>
                  {formattedDate && <span>{formattedDate}</span>}
                </div>
                {item.remarks && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5 leading-snug">
                    &quot;{item.remarks}&quot;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
