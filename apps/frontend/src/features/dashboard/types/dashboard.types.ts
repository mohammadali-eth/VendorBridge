export interface KpiCardData {
  // Procurement Officer
  activeRfqs?: {
    value: number;
    change: string;
  };
  pendingQuotations?: {
    value: number;
    subtext: string;
  };
  poValue?: {
    value: string;
    label: string;
  };
  invoicesGenerated?: {
    value: number;
    subtext: string;
  };

  // Vendor
  assignedRfqs?: {
    value: number;
    subtext: string;
  };
  submittedQuotations?: {
    value: number;
    subtext: string;
  };
  approvedPos?: {
    value: number;
    subtext: string;
  };
  pendingPayments?: {
    value: string;
    subtext: string;
  };

  // Manager
  pendingApprovals?: {
    value: number;
    status: string;
  };
  approvedRequests?: {
    value: number;
    subtext: string;
  };
  rejectedRequests?: {
    value: number;
    subtext: string;
  };
  workflowStatus?: {
    value: string;
    subtext: string;
  };

  // Admin
  totalUsers?: {
    value: number;
    subtext: string;
  };
  totalVendors?: {
    value: number;
    subtext: string;
  };
  procurementSpend?: {
    value: string;
    subtext: string;
  };
  analyticsSummary?: {
    value: string;
    subtext: string;
  };

  // Legacy/fallback compatibility
  overdueInvoices?: {
    value: number;
    status: string;
  };
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Draft' | 'Rejected';
  date: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Activity {
  id: string;
  user: string;
  activity: string;
  timestamp: string;
}

export interface SpendHistory {
  month: string;
  spend: number;
}

export interface SpendDistribution {
  name: string;
  value: number;
}

export interface ApprovalRequest {
  id: string;
  request: string;
  department: string;
  amount: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalyticsData {
  spendHistory: SpendHistory[];
  spendDistribution: SpendDistribution[];
  approvalQueue: ApprovalRequest[];
}
