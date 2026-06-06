import React from 'react';
import clsx from 'clsx';

interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  rowKey: (row: T) => string | number;
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  emptyState,
  rowKey,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full -mx-6 px-6">
      <table className="min-w-full divide-y divide-slate-100 text-left text-sm leading-5">
        <thead>
          <tr className="bg-slate-50/50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={clsx(
                  'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            // Skeleton row simulation
            Array.from({ length: 4 }).map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                {emptyState || (
                  <p className="text-slate-500">No data found</p>
                )}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={clsx(
                      'px-6 py-4 whitespace-nowrap text-slate-700 font-medium',
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? String(row[col.accessor as keyof T] || '')
                      : ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
