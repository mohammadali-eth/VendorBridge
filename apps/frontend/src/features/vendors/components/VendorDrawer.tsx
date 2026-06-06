import React, { useState } from 'react';
import { X, FileText, Globe, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
import { useVendorDetailsQuery } from '../hooks/useVendors';
import Badge from '@/components/common/Badge';

interface VendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string | null;
}

type TabType = 'overview' | 'compliance' | 'history' | 'invoices' | 'documents';

export default function VendorDrawer({ isOpen, onClose, vendorId }: VendorDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch details using React Query
  const { data: details, isLoading, isError } = useVendorDetailsQuery(vendorId);

  if (!isOpen) return null;

  const getStatusType = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'BLOCKED':
      case 'REJECTED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getPoStatusType = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'DELIVERED':
        return 'success';
      case 'SENT':
      case 'DRAFT':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full text-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            {isLoading ? (
              <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
            ) : (
              <h3 className="text-lg font-bold text-[#111827] flex items-center gap-3">
                {details?.vendor.name}
                <Badge variant={getStatusType(details?.vendor.status)}>
                  {details?.vendor.status || 'PENDING'}
                </Badge>
              </h3>
            )}
            <p className="text-xs text-slate-500 mt-1.5">
              Vendor Code: <span className="font-semibold text-slate-700">{details?.vendor.code || 'N/A'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-slate-100 px-6 overflow-x-auto gap-5 flex-shrink-0">
          {(
            [
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'compliance', label: 'GST & Tax', icon: ShieldCheck },
              { id: 'history', label: 'Spend & POs', icon: ShoppingBag },
              { id: 'invoices', label: 'Invoices', icon: CreditCard },
              { id: 'documents', label: 'Documents', icon: FileText },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 border-b-2 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#714B67] text-[#714B67]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-rose-600">Failed to load supplier details.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                      Supplier Identity
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Legal Name</span>
                        <span className="text-xs font-semibold text-[#111827]">{details?.vendor.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Registration</span>
                        <span className="text-xs font-semibold text-[#111827]">{details?.vendor.registrationNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Category</span>
                        <span className="text-xs font-semibold text-[#111827]">{details?.vendor.category || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Model Type</span>
                        <span className="text-xs font-semibold text-[#111827]">{details?.vendor.type || 'Manufacturer'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Contact Person</span>
                        <span className="font-bold text-[#111827]">{details?.vendor.contactPerson} ({details?.vendor.designation || 'Officer'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Primary Email</span>
                        <span className="font-bold text-[#111827]">{details?.vendor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Primary Phone</span>
                        <span className="font-bold text-[#111827]">{details?.vendor.phone || 'N/A'}</span>
                      </div>
                      {details?.vendor.alternatePhone && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Alt Phone</span>
                          <span className="font-bold text-[#111827]">{details?.vendor.alternatePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                      Office Address Details
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                      <p className="font-semibold text-slate-700">
                        {details?.vendor.addressLine1 || details?.vendor.address || 'N/A'}
                      </p>
                      {details?.vendor.addressLine2 && <p className="text-slate-500">{details.vendor.addressLine2}</p>}
                      <p className="text-slate-600 font-medium">
                        {details?.vendor.city && `${details.vendor.city}, `}
                        {details?.vendor.state && `${details.vendor.state}, `}
                        {details?.vendor.country && `${details.vendor.country} `}
                        {details?.vendor.pincode && ` - ${details.vendor.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Compliance */}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                      Tax Registrations
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">GSTIN Code</span>
                        <span className="text-xs font-bold text-[#111827] tracking-wider uppercase">
                          {details?.vendor.gstNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">PAN Code</span>
                        <span className="text-xs font-bold text-[#111827] tracking-wider uppercase">
                          {details?.vendor.panNumber || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {details?.vendor.taxDetails && (
                    <div>
                      <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                        MSE / Tax Filing Details
                      </h4>
                      <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                        {details.vendor.taxDetails}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Spend & Purchase History */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Orders</span>
                      <span className="text-lg font-black text-[#111827] block mt-1">
                        {details?.metrics?.totalOrders || 0}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Spend</span>
                      <span className="text-lg font-black text-[#714B67] block mt-1">
                        {formatCurrency(details?.metrics?.totalSpend || 0)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                      Recent Purchase Orders
                    </h4>
                    {details?.vendor.pos && details.vendor.pos.length > 0 ? (
                      <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                        {details.vendor.pos.map((po: any) => (
                          <div key={po.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#111827]">{po.poNumber}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {new Date(po.createdAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-800">
                                {formatCurrency(Number(po.totalAmount))}
                              </span>
                              <Badge variant={getPoStatusType(po.status)}>
                                {po.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <span className="text-xs text-slate-500 font-medium">No order history available.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Invoices */}
              {activeTab === 'invoices' && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                    Billing Schedules
                  </h4>
                  {details?.invoices && details.invoices.length > 0 ? (
                    <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                      {details.invoices.map((inv) => (
                        <div key={inv.id} className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#111827]">{inv.invoiceNo}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{inv.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800">{formatCurrency(inv.amount)}</span>
                            <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>
                              {inv.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <span className="text-xs text-slate-500 font-medium">No billing history logs.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Documents */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-3">
                    Uploaded Compliance Certificates
                  </h4>
                  <div className="space-y-3">
                    {details?.documents?.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F5EEF4] text-[#714B67] rounded-lg">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Expiry: {doc.expiryDate}
                            </span>
                          </div>
                        </div>
                        <Badge variant="success">{doc.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
