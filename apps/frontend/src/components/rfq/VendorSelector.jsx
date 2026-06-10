import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, X, Loader2, Plus, Check } from 'lucide-react';
import { rfqService } from '../../services/rfq.service';

export default function VendorSelector() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedVendorIds = watch('assignedVendorIds') || [];

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    async function loadVendors() {
      try {
        const data = await rfqService.getVendors();
        setVendors(data.vendors || []);
      } catch (err) {
        console.error('Failed to load vendors', err);
      } finally {
        setLoading(false);
      }
    }
    loadVendors();
  }, []);

  const handleToggleVendor = (id) => {
    const next = selectedVendorIds.includes(id)
      ? selectedVendorIds.filter((item) => item !== id)
      : [...selectedVendorIds, id];
    setValue('assignedVendorIds', next, { shouldValidate: true });
  };

  const handleRemoveVendor = (id) => {
    const next = selectedVendorIds.filter((item) => item !== id);
    setValue('assignedVendorIds', next, { shouldValidate: true });
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedVendors = vendors.filter((v) => selectedVendorIds.includes(v.id));

  return (
    <div className="space-y-4 text-left">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ASSIGN VENDORS</h4>

      {loading ? (
        <div className="flex items-center gap-2 py-3 text-slate-500 text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-[#714B67]" />
          Loading vendors...
        </div>
      ) : (
        <div className="space-y-3">
          {/* Selected Vendors Box */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white min-h-[80px] space-y-2">
            {selectedVendors.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-3 text-center">
                No vendors assigned yet.
              </p>
            ) : (
              selectedVendors.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                >
                  <span className="text-xs font-bold text-slate-800">{v.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVendor(v.id)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Search Toggle button */}
          <div className="relative">
            {!showSearch ? (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" />+ add vendor
              </button>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search supplier list..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Dropdown list */}
                <div className="border border-slate-200 rounded-2xl max-h-40 overflow-y-auto bg-white shadow-lg py-1 divide-y divide-slate-50">
                  {filteredVendors.length === 0 ? (
                    <p className="p-3 text-[10px] text-slate-400 text-center">No vendors found.</p>
                  ) : (
                    filteredVendors.map((vendor) => {
                      const isSelected = selectedVendorIds.includes(vendor.id);
                      return (
                        <div
                          key={vendor.id}
                          onClick={() => handleToggleVendor(vendor.id)}
                          className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">{vendor.name}</span>
                            <span className="text-[10px] text-slate-400 block">{vendor.email}</span>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-[#714B67] stroke-[3]" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.assignedVendorIds && (
            <p className="text-rose-600 text-xs font-semibold mt-1">
              {errors.assignedVendorIds.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
