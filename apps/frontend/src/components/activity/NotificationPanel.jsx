import React from 'react';
import { X, Check, Trash2, Bell, CheckCheck } from 'lucide-react';

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onClear,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-55 flex flex-col text-left transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell className="h-4 w-4 text-[#714B67]" />
          <h3 className="text-xs font-black text-slate-800">Notifications</h3>
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="bg-[#714B67] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Action triggers */}
      <div className="p-3 border-b border-slate-50 flex items-center justify-between">
        <button
          onClick={onMarkAllRead}
          className="text-[10px] text-[#714B67] hover:underline font-black flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck size={12} />
          Mark all as read
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium text-xs space-y-2">
            <Bell className="h-6 w-6 mx-auto text-slate-250" />
            <p>Your notification tray is empty.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`p-4 space-y-2 transition-colors ${n.read ? 'bg-white' : 'bg-purple-50/20'}`}>
              <div className="flex justify-between items-start gap-2">
                <h4 className={`text-[11px] leading-tight ${n.read ? 'text-slate-700 font-semibold' : 'text-slate-900 font-black'}`}>
                  {n.title}
                </h4>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="p-1 hover:bg-slate-100 rounded text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check size={11} />
                    </button>
                  )}
                  <button
                    onClick={() => onClear(n.id)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Clear notification"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                {n.description}
              </p>
              <span className="text-[9px] text-slate-400 font-bold block pt-1">
                {new Date(n.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
