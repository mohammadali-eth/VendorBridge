import React from 'react';
import { Check } from 'lucide-react';

export default function WorkflowTracker({ status }) {
  // Determine current active step (1-indexed)
  // 1. RFQ Created
  // 2. Quotation Received
  // 3. Vendor Selected
  // 4. Approval Review
  // 5. Purchase Order Generated
  let activeStep = 4; // Defaults to review stage
  if (status === 'APPROVED') {
    activeStep = 5;
  } else if (status === 'REJECTED' || status === 'REVISED') {
    activeStep = 4; // Stays on review/decision
  }

  const steps = [
    { number: 1, name: 'RFQ Created' },
    { number: 2, name: 'Quotation Received' },
    { number: 3, name: 'Vendor Selected' },
    { number: 4, name: 'Approval Review' },
    { number: 5, name: 'Purchase Order Generated' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
        {steps.map((step, index) => {
          const isCompleted = step.number < activeStep;
          const isActive = step.number === activeStep;
          const isRejected = (status === 'REJECTED' || status === 'REVISED') && isActive;

          return (
            <React.Fragment key={step.number}>
              {/* Connector line on desktop */}
              {index > 0 && (
                <div className="hidden md:block flex-1 h-0.5 bg-slate-100 relative">
                  <div
                    className={`absolute inset-0 bg-[#714B67] transition-all duration-300 ${
                      isCompleted ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center shrink-0">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    isCompleted
                      ? 'bg-[#714B67] text-white'
                      : isActive
                        ? isRejected
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-[#A87D9F] text-white border-2 border-[#714B67]/20 shadow-md ring-4 ring-[#F5EEF4]'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isActive
                        ? isRejected
                          ? 'text-rose-600'
                          : 'text-slate-800'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    {step.name}
                  </span>
                  {isActive && (
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#714B67] block">
                      {isRejected ? status : 'Current Step'}
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
