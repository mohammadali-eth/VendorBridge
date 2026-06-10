import React from 'react';
import Badge from '../common/Badge';

export default function AuditLogTable({ logs = [] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">Log ID</th>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Module</th>
              <th className="py-3 px-5">Action</th>
              <th className="py-3 px-5">Entity</th>
              <th className="py-3 px-5">Date & Time</th>
              <th className="py-3 px-5">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                  No audit entries logged for current parameters.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 font-black text-slate-900">{log.logId}</td>
                  <td className="py-3 px-5">{log.user}</td>
                  <td className="py-3 px-5">
                    <Badge variant="neutral">{log.module}</Badge>
                  </td>
                  <td className="py-3 px-5 text-slate-800 font-bold">{log.action}</td>
                  <td className="py-3 px-5 text-slate-500 font-medium">{log.entity}</td>
                  <td className="py-3 px-5 text-slate-500 font-medium">
                    {new Date(log.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-5 text-slate-400 font-mono font-medium">
                    {log.ipAddress}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
