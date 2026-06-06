export type VendorStatusType = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'BLOCKED';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  status: VendorStatusType;
  code?: string;
  category?: string;
  type?: string;
  gstNumber?: string;
  panNumber?: string;
  taxDetails?: string;
  contactPerson?: string;
  designation?: string;
  alternatePhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorFilters {
  search?: string;
  status?: string;
  category?: string;
  state?: string;
  city?: string;
}

export interface VendorPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VendorListResponse {
  vendors: Vendor[];
  pagination: VendorPagination;
}

export interface VendorMetrics {
  totalOrders: number;
  totalSpend: number;
}

export interface VendorDocument {
  id: string;
  name: string;
  status: string;
  expiryDate: string;
}

export interface VendorInvoice {
  id: string;
  invoiceNo: string;
  amount: number;
  status: string;
  date: string;
}

export interface VendorDetailsResponse {
  vendor: Vendor & {
    pos?: Array<{
      id: string;
      poNumber: string;
      totalAmount: number | string;
      status: string;
      createdAt: string;
    }>;
  };
  metrics: VendorMetrics;
  documents: VendorDocument[];
  invoices: VendorInvoice[];
}
