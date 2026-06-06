import React, { useState, useEffect } from 'react';
import { X, Info, ShieldAlert } from 'lucide-react';
import { Vendor, VendorStatusType } from '../types/vendor.types';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Vendor>) => void;
  vendor?: Vendor | null;
  categories: string[];
  statuses: string[];
}

export default function VendorModal({
  isOpen,
  onClose,
  onSave,
  vendor = null,
  categories,
  statuses,
}: VendorModalProps) {
  const isEdit = !!vendor;

  // Form states
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    code: '',
    category: 'Manufacturer',
    type: 'Manufacturer',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    taxDetails: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    status: 'PENDING',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) {
      setFormData({ ...vendor });
    } else {
      setFormData({
        name: '',
        code: '',
        category: categories[0] || 'Manufacturer',
        type: 'Manufacturer',
        registrationNumber: '',
        gstNumber: '',
        panNumber: '',
        taxDetails: '',
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        alternatePhone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        status: 'PENDING',
      });
    }
    setErrors({});
  }, [vendor, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required Fields validation
    if (!formData.name?.trim()) newErrors.name = 'Vendor Name is required';
    if (!formData.category) newErrors.category = 'Vendor Category is required';
    if (!formData.contactPerson?.trim()) newErrors.contactPerson = 'Contact Person is required';

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email address format';
      }
    }

    // GSTIN format validation (India GSTIN format check)
    if (!formData.gstNumber?.trim()) {
      newErrors.gstNumber = 'GST Number is required';
    } else {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gstNumber.trim().toUpperCase())) {
        newErrors.gstNumber = 'Invalid GSTIN format (e.g. 27AAAAA1111A1Z1)';
      }
    }

    // Optional Phone format check
    if (formData.phone?.trim()) {
      const phoneRegex = /^[0-9+() -]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      gstNumber: formData.gstNumber?.trim().toUpperCase(),
      panNumber: formData.panNumber?.trim().toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEdit ? 'Modify Supplier Record' : 'Register New Vendor'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide necessary tax registration, addresses, and contacts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-900">Validation Failures</h4>
                <p className="text-xs text-rose-600 mt-0.5">Please review highlighted fields before saving.</p>
              </div>
            </div>
          )}

          {/* Section A: Basic Info */}
          <div>
            <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-4 pb-1 border-b border-[#F5EEF4]">
              SECTION A: Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Vendor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#714B67]'} rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2`}
                  placeholder="Acme Electronics Ltd"
                />
                {errors.name && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Vendor Code (Optional)
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Leave empty for auto-generation"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Vendor Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Vendor Type (Operational Model)
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="OEM">OEM</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Subcontractor">Subcontractor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="CIN-U72200MH2026PTC395"
                />
              </div>
            </div>
          </div>

          {/* Section B: Tax & GST */}
          <div>
            <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-4 pb-1 border-b border-[#F5EEF4]">
              SECTION B: GST & Tax Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  GSTIN Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.gstNumber ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#714B67]'} rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 uppercase`}
                  placeholder="27ABCDE1234F1Z5"
                />
                {errors.gstNumber && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.gstNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  PAN Number (Optional)
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67] uppercase"
                  placeholder="ABCDE1234F"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Tax Registration Details / Comments
                </label>
                <input
                  type="text"
                  name="taxDetails"
                  value={formData.taxDetails}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Registered under MSE sector / Custom tax exemptions"
                />
              </div>
            </div>
          </div>

          {/* Section C: Contact Information */}
          <div>
            <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-4 pb-1 border-b border-[#F5EEF4]">
              SECTION C: Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Contact Person Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.contactPerson ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#714B67]'} rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2`}
                  placeholder="John Doe"
                />
                {errors.contactPerson && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Procurement Officer / Manager"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#714B67]'} rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2`}
                  placeholder="supplier@acme.com"
                />
                {errors.email && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#714B67]'} rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2`}
                  placeholder="+91 9988776655"
                />
                {errors.phone && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Alternate Phone
                </label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Alternate number"
                />
              </div>
            </div>
          </div>

          {/* Section D: Address Information */}
          <div>
            <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-4 pb-1 border-b border-[#F5EEF4]">
              SECTION D: Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Building No. 5, Tech Park"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Phase II, Industrial Area"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="Maharashtra"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="India"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  placeholder="400001"
                />
              </div>
            </div>
          </div>

          {/* Section E: Vendor Status */}
          <div>
            <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wider mb-4 pb-1 border-b border-[#F5EEF4]">
              SECTION E: Vendor Status
            </h4>
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Current Account Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 border border-slate-200 hover:bg-slate-100 text-[#111827] rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-6 bg-[#714B67] hover:bg-[#583b51] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Save Vendor
          </button>
        </div>
      </div>
    </div>
  );
}
