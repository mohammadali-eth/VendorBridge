import React, { useState } from 'react';
import Card from '../common/Card';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AuditTrailTable({ auditLogs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.action?.toLowerCase().includes(term) ||
      log.performedBy?.toLowerCase().includes(term) ||
      log.remarks?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="text-left space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Audit Trail</h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Compliance and change logs history
          </p>
        </div>
        <div className="relative text-slate-400 focus-within:text-[#714B67] max-w-xs w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Search size={14} />
          </div>
          <input
            type="search"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1 pl-8 pr-3 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 border-b border-slate-150">
              <th className="py-2.5 px-4 font-bold text-left">Action</th>
              <th className="py-2.5 px-4 font-bold text-left">Performed By</th>
              <th className="py-2.5 px-4 font-bold text-left">Timestamp</th>
              <th className="py-2.5 px-4 font-bold text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                  No matching audit logs found.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-800 font-black">{log.action}</td>
                  <td className="py-2.5 px-4">{log.performedBy}</td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {(() => {
                      if (!log.timestamp) return '';
                      const d = new Date(log.timestamp);
                      return isNaN(d.getTime())
                        ? ''
                        : d.toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                    })()}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate" title={log.remarks}>
                    {log.remarks}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-slate-400 font-bold">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} of{' '}
            {filteredLogs.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft size={14} className="text-slate-650" />
            </button>
            <span className="text-[10px] text-slate-800 font-black px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight size={14} className="text-slate-650" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
