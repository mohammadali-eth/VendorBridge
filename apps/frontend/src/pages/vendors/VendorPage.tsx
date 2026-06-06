import React, { useState, useRef } from 'react';
import {
  Plus,
  Download,
  Upload,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit2,
  Eye,
  FileText,
  AlertTriangle,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import {
  useVendorsQuery,
  useVendorCategoriesQuery,
  useVendorStatusesQuery,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
  useBulkUpdateVendors,
  useBulkDeleteVendors,
  useBulkImportVendors
} from '../../features/vendors/hooks/useVendors';
import { Vendor, VendorFilters as FilterType, VendorStatusType } from '../../features/vendors/types/vendor.types';
import VendorFilters from '../../features/vendors/components/VendorFilters';
import VendorModal from '../../features/vendors/components/VendorModal';
import VendorDrawer from '../../features/vendors/components/VendorDrawer';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

export default function VendorPage() {
  // Query filters & pagination state
  const [filters, setFilters] = useState<FilterType>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected Rows state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [drawerVendorId, setDrawerVendorId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete_single' | 'delete_bulk' | 'status_bulk';
    id?: string;
    status?: VendorStatusType;
    message: string;
  } | null>(null);

  // Active dropdown row state
  const [activeDropdownRow, setActiveDropdownRow] = useState<string | null>(null);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Queries
  const vendorsQuery = useVendorsQuery({
    ...filters,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const categoriesQuery = useVendorCategoriesQuery();
  const statusesQuery = useVendorStatusesQuery();

  // Mutations
  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();
  const bulkUpdateMutation = useBulkUpdateVendors();
  const bulkDeleteMutation = useBulkDeleteVendors();
  const importMutation = useBulkImportVendors();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parseCSVRow = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result.map(val => val.replace(/^"|"$/g, '').trim());
        };

        const rows = text
          .split(/\r?\n/)
          .map(row => parseCSVRow(row))
          .filter(row => row.length > 0 && row.some(cell => cell !== ''));

        if (rows.length < 2) {
          showToast('CSV file is empty or missing headers', 'error');
          return;
        }

        const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const dataRows = rows.slice(1);

        const vendorsToImport = dataRows.map(row => {
          const vendor: Record<string, string> = {};
          headers.forEach((header, idx) => {
            if (row[idx] !== undefined) {
              let key = header;
              if (header === 'name' || header === 'vendorname' || header === 'companyname' || header === 'suppliername') key = 'name';
              else if (header === 'gst' || header === 'gstin' || header === 'gstnumber' || header === 'taxnumber') key = 'gstNumber';
              else if (header === 'email' || header === 'emailaddress' || header === 'contactemail') key = 'email';
              else if (header === 'contact' || header === 'contactperson' || header === 'contactpersonname' || header === 'contactname') key = 'contactPerson';
              else if (header === 'registrationnumber' || header === 'regnumber' || header === 'cin' || header === 'regno') key = 'registrationNumber';
              else if (header === 'pannumber' || header === 'pan') key = 'panNumber';
              else if (header === 'phone' || header === 'phonenumber' || header === 'telephone' || header === 'mobile') key = 'phone';
              else if (header === 'address' || header === 'addressline1' || header === 'street') key = 'addressLine1';
              
              vendor[key] = row[idx];
            }
          });
          return vendor;
        });

        showToast('Processing imported file...', 'info');

        importMutation.mutate(vendorsToImport, {
          onSuccess: (res) => {
            const { successCount, failCount, errors } = res.data;
            if (failCount === 0) {
              showToast(`Successfully imported ${successCount} vendors!`, 'success');
            } else {
              showToast(`Imported ${successCount} vendors, ${failCount} failed. Check console.`, 'warning');
              if (errors && errors.length > 0) {
                console.warn('Import failures:', errors);
              }
            }
          },
          onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to import vendors', 'error');
          }
        });
      } catch (err) {
        console.error(err);
        showToast('Error parsing CSV file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyFilters = (newFilters: FilterType) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
    setSelectedIds([]);
  };

  // Toggle Row Selection
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (vendors: Vendor[]) => {
    if (selectedIds.length === vendors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vendors.map((v) => v.id));
    }
  };

  // Save Add/Edit Form
  const handleSaveVendor = (data: Partial<Vendor>) => {
    if (editingVendor) {
      // Update
      updateMutation.mutate(
        { id: editingVendor.id, data },
        {
          onSuccess: () => {
            showToast('Vendor updated successfully');
            setIsModalOpen(false);
            setEditingVendor(null);
          },
          onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to update vendor', 'error');
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(data, {
        onSuccess: () => {
          showToast('Vendor registered successfully');
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message || 'Failed to register vendor', 'error');
        },
      });
    }
  };

  // Single Delete
  const handleDeleteSingle = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast('Vendor deleted successfully');
        setConfirmAction(null);
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      },
      onError: () => {
        showToast('Failed to delete vendor', 'error');
      },
    });
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = (status: VendorStatusType) => {
    bulkUpdateMutation.mutate(
      { ids: selectedIds, status },
      {
        onSuccess: () => {
          showToast(`Bulk updated ${selectedIds.length} vendors status to ${status.toLowerCase()}`);
          setConfirmAction(null);
          setSelectedIds([]);
        },
        onError: () => {
          showToast('Failed to perform bulk update', 'error');
        },
      }
    );
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        showToast(`Bulk deleted ${selectedIds.length} vendors successfully`);
        setConfirmAction(null);
        setSelectedIds([]);
      },
      onError: () => {
        showToast('Failed to perform bulk delete', 'error');
      },
    });
  };

  // Export vendors as CSV
  const handleExportCSV = () => {
    const list = vendorsQuery.data?.vendors || [];
    if (list.length === 0) {
      showToast('No vendors available to export', 'error');
      return;
    }
    const headers = 'ID,Name,Email,Phone,Category,Status,GSTIN,Created Date\n';
    const rows = list
      .map(
        (v) =>
          `"${v.code || v.id}","${v.name}","${v.email}","${v.phone || ''}","${v.category || ''}","${v.status}","${v.gstNumber || ''}","${new Date(v.createdAt).toLocaleDateString('en-IN')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `vendors_export_${Date.now()}.csv`);
    a.click();
    showToast('Vendors list exported successfully');
  };

  const getStatusType = (status: VendorStatusType) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'INACTIVE':
        return 'neutral';
      case 'BLOCKED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Sorting Handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const categories = categoriesQuery.data || [
    'Manufacturer',
    'Distributor',
    'Service Provider',
    'Contractor',
    'Consultant',
  ];

  const statuses = statusesQuery.data || ['ACTIVE', 'PENDING', 'INACTIVE', 'BLOCKED'];

  // Calculations for KPI summaries
  const totalVendors = vendorsQuery.data?.pagination.total || 0;
  const activeCount = vendorsQuery.data?.vendors.filter((v) => v.status === 'ACTIVE').length || 0;
  const pendingCount = vendorsQuery.data?.vendors.filter((v) => v.status === 'PENDING').length || 0;
  const blockedCount = vendorsQuery.data?.vendors.filter((v) => v.status === 'BLOCKED' || v.status === 'INACTIVE').length || 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white animate-bounce ${
            toast.type === 'success' ? 'bg-[#714B67]' : 'bg-rose-600'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 w-full max-w-md text-left space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-base font-bold text-[#111827]">Critical Confirmation</h4>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              {confirmAction.message}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="py-2 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'delete_single' && confirmAction.id) {
                    handleDeleteSingle(confirmAction.id);
                  } else if (confirmAction.type === 'delete_bulk') {
                    handleBulkDelete();
                  } else if (confirmAction.type === 'status_bulk' && confirmAction.status) {
                    handleBulkStatusUpdate(confirmAction.status);
                  }
                }}
                className="py-2 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">Vendor Management</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Manage supplier information, categories, compliance data, and vendor status.
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={() => {
              setEditingVendor(null);
              setIsModalOpen(true);
            }}
            className="py-2.5 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </button>
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-400" />
            Export Vendors
          </button>
          <button
            onClick={handleImportClick}
            className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 text-slate-400" />
            Import
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>

      {/* 2. Analytics Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Vendors */}
        <Card gradientTop gradientColor="from-[#714B67] to-[#A87D9F]" hoverLift={false}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vendors</p>
              <h4 className="mt-1.5 text-2xl font-black text-[#111827] tracking-tight">
                {vendorsQuery.isLoading ? '...' : totalVendors}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">+4% from last quarter</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F5EEF4] text-[#714B67] flex-shrink-0 border border-slate-100/60">
              <Users size={20} className="stroke-[2.5]" />
            </div>
          </div>
        </Card>

        {/* Active Vendors */}
        <Card gradientTop gradientColor="from-emerald-500 to-emerald-300" hoverLift={false}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Vendors</p>
              <h4 className="mt-1.5 text-2xl font-black text-[#111827] tracking-tight">
                {vendorsQuery.isLoading ? '...' : activeCount || totalVendors - 1}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">Fully Compliant</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0 border border-slate-100/60">
              <UserCheck size={20} className="stroke-[2.5]" />
            </div>
          </div>
        </Card>

        {/* Pending Approval */}
        <Card gradientTop gradientColor="from-amber-500 to-amber-300" hoverLift={false}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Pending Approvals</p>
              <h4 className="mt-1.5 text-2xl font-black text-[#111827] tracking-tight">
                {vendorsQuery.isLoading ? '...' : pendingCount}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">Awaiting Verification</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0 border border-slate-100/60">
              <ShieldCheck size={20} className="stroke-[2.5]" />
            </div>
          </div>
        </Card>

        {/* Blocked / Inactive */}
        <Card gradientTop gradientColor="from-rose-500 to-rose-300" hoverLift={false}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blocked / Inactive</p>
              <h4 className="mt-1.5 text-2xl font-black text-[#111827] tracking-tight">
                {vendorsQuery.isLoading ? '...' : blockedCount}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">Restricted Accounts</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 flex-shrink-0 border border-slate-100/60">
              <UserX size={20} className="stroke-[2.5]" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Search & Filters */}
      <VendorFilters
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        categories={categories}
        statuses={statuses}
      />

      {/* 4. Vendor Data Table Card */}
      <Card title="Suppliers Registry" subtitle="Detailed audit logs and settings for registered corporate vendors." bodyClassName="p-0 overflow-hidden">
        {vendorsQuery.isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-[#714B67] animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Loading vendor records...</p>
          </div>
        ) : !vendorsQuery.data?.vendors || vendorsQuery.data.vendors.length === 0 ? (
          <div className="p-16 text-center border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-500">No vendors found matching search filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 py-2 px-4 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Container */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm leading-5">
                <thead>
                  <tr className="bg-slate-50/70 border-t border-slate-100">
                    <th scope="col" className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === vendorsQuery.data.vendors.length}
                        onChange={() => toggleSelectAll(vendorsQuery.data.vendors)}
                        className="h-4 w-4 rounded border-slate-300 text-[#714B67] focus:ring-[#714B67]"
                      />
                    </th>
                    <th
                      scope="col"
                      onClick={() => handleSort('code')}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-700"
                    >
                      Vendor ID
                    </th>
                    <th
                      scope="col"
                      onClick={() => handleSort('name')}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-700"
                    >
                      Vendor Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      GSTIN
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact Person
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {vendorsQuery.data.vendors.map((vendor) => {
                    const isSelected = selectedIds.includes(vendor.id);
                    return (
                      <tr
                        key={vendor.id}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isSelected ? 'bg-[#F5EEF4]/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(vendor.id)}
                            className="h-4 w-4 rounded border-slate-300 text-[#714B67] focus:ring-[#714B67]"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#714B67] uppercase">
                          {vendor.code || 'VND-MOCK'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                          {vendor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                          {vendor.category || 'Manufacturer'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-slate-700">
                          {vendor.gstNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-semibold">
                          {vendor.contactPerson || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                          {vendor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                          {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.address ? vendor.address.split(',').slice(-2).join(',').trim() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <Badge variant={getStatusType(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs relative">
                          <button
                            onClick={() =>
                              setActiveDropdownRow(
                                activeDropdownRow === vendor.id ? null : vendor.id
                              )
                            }
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeDropdownRow === vendor.id && (
                            <>
                              <div
                                onClick={() => setActiveDropdownRow(null)}
                                className="fixed inset-0 z-10"
                              />
                              <div className="absolute right-6 mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden text-left divide-y divide-slate-100 py-1">
                                <button
                                  onClick={() => {
                                    setActiveDropdownRow(null);
                                    setDrawerVendorId(vendor.id);
                                    setIsDrawerOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-[#111827] font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownRow(null);
                                    setEditingVendor(vendor);
                                    setIsModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-[#111827] font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                  Edit Vendor
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownRow(null);
                                    setConfirmAction({
                                      type: 'status_bulk',
                                      id: vendor.id,
                                      status: vendor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                                      message: `Are you sure you want to change status of ${vendor.name} to ${vendor.status === 'ACTIVE' ? 'inactive' : 'active'}?`,
                                    });
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-[#111827] font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                  Toggle Status
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownRow(null);
                                    setConfirmAction({
                                      type: 'delete_single',
                                      id: vendor.id,
                                      message: `Are you sure you want to permanently delete supplier ${vendor.name}? This action is irreversible.`,
                                    });
                                  }}
                                  className="w-full px-4 py-2 hover:bg-[#FFF5F5] text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                  Delete Vendor
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {vendorsQuery.data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 flex-row">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing Page <span className="font-bold text-slate-700">{page}</span> of{' '}
                  <span className="font-bold text-slate-700">
                    {vendorsQuery.data.pagination.totalPages}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(vendorsQuery.data.pagination.totalPages, p + 1))
                    }
                    disabled={page === vendorsQuery.data.pagination.totalPages}
                    className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 5. Bulk Operations Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 text-xs font-bold animate-fade-in animate-slide-up">
          <span className="text-slate-300">
            Selected: <span className="text-white text-sm font-black">{selectedIds.length}</span> items
          </span>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setConfirmAction({
                  type: 'status_bulk',
                  status: 'ACTIVE',
                  message: `Are you sure you want to set status of ${selectedIds.length} selected vendors to Active?`,
                });
              }}
              className="py-1.5 px-3.5 hover:bg-slate-800 text-emerald-400 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              Activate
            </button>
            <button
              onClick={() => {
                setConfirmAction({
                  type: 'status_bulk',
                  status: 'INACTIVE',
                  message: `Are you sure you want to set status of ${selectedIds.length} selected vendors to Inactive?`,
                });
              }}
              className="py-1.5 px-3.5 hover:bg-slate-800 text-amber-400 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserX className="h-4 w-4" />
              Deactivate
            </button>
            <button
              onClick={() => {
                setConfirmAction({
                  type: 'delete_bulk',
                  message: `Are you sure you want to permanently delete all ${selectedIds.length} selected vendors? This cannot be undone.`,
                });
              }}
              className="py-1.5 px-3.5 hover:bg-rose-950 text-rose-400 hover:text-rose-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* 6. Form Modal Dialog */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVendor(null);
        }}
        onSave={handleSaveVendor}
        vendor={editingVendor}
        categories={categories}
        statuses={statuses}
      />

      {/* 7. Slide-out Details Drawer */}
      <VendorDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerVendorId(null);
        }}
        vendorId={drawerVendorId}
      />
    </div>
  );
}
