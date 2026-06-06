import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown } from 'lucide-react';
import Card from '@/components/common/Card';
import { VendorFilters as FilterType } from '../types/vendor.types';

interface VendorFiltersProps {
  onApply: (filters: FilterType) => void;
  onReset: () => void;
  categories: string[];
  statuses: string[];
}

export default function VendorFilters({
  onApply,
  onReset,
  categories,
  statuses,
}: VendorFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      search: search || undefined,
      status: status || undefined,
      category: category || undefined,
      state: state || undefined,
      city: city || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setState('');
    setCity('');
    onReset();
  };

  const formatStatusLabel = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vendor name, ID, GST, contact person, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex w-full md:w-auto items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-1 md:flex-initial py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Filter className="h-4 w-4 text-slate-500" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="submit"
              className="flex-1 md:flex-initial py-3 px-6 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset Filters"
              className="py-3 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filter Row (Collapsible) */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E5E7EB]">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {formatStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                State
              </label>
              <input
                type="text"
                placeholder="State (e.g. Maharashtra)"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="City (e.g. Mumbai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              />
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
