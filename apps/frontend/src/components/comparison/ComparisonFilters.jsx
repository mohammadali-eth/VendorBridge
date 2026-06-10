import React from 'react';
import { SlidersHorizontal, ShieldCheck, Clock, CircleDollarSign } from 'lucide-react';

export default function ComparisonFilters({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  maxDelivery,
  setMaxDelivery,
  maxPriceLimit = 1000000,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-[#714B67]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Comparison Controls</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setSortBy('price');
            setPriceRange(maxPriceLimit);
            setMinRating(0);
            setMaxDelivery(30);
          }}
          className="text-[10px] font-bold text-[#714B67] hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Sorting Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Sort Quotations By
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSortBy('price')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer border ${
              sortBy === 'price'
                ? 'bg-[#714B67] text-white border-[#714B67]'
                : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CircleDollarSign className="h-4 w-4" />
            Lowest Price
          </button>

          <button
            type="button"
            onClick={() => setSortBy('rating')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer border ${
              sortBy === 'rating'
                ? 'bg-[#714B67] text-white border-[#714B67]'
                : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Vendor Rating
          </button>

          <button
            type="button"
            onClick={() => setSortBy('delivery')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer border ${
              sortBy === 'delivery'
                ? 'bg-[#714B67] text-white border-[#714B67]'
                : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="h-4 w-4" />
            Delivery Speed
          </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Price Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Max Budget</span>
          <span className="text-slate-800 lowercase">
            ₹{priceRange.toLocaleString('en-IN')} max
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPriceLimit}
          step="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#714B67] cursor-pointer"
        />
      </div>

      {/* Rating Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Min Rating</span>
          <span className="text-slate-800 lowercase">{minRating} / 5 stars</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full accent-[#714B67] cursor-pointer"
        />
      </div>

      {/* Delivery Days Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Max Delivery Time</span>
          <span className="text-slate-800 lowercase">{maxDelivery} days</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={maxDelivery}
          onChange={(e) => setMaxDelivery(Number(e.target.value))}
          className="w-full accent-[#714B67] cursor-pointer"
        />
      </div>
    </div>
  );
}
