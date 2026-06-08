export const ROLE_PERMISSIONS = {
  procurement_officer: [
    'CREATE_RFQ',
    'EDIT_RFQ',
    'VIEW_RFQ',
    'COMPARE_QUOTATIONS',
    'GENERATE_PO',
    'GENERATE_INVOICE',
    'VIEW_RECORDS',
    'TRACK_STATUS'
  ],
  vendor: [
    'VIEW_ASSIGNED_RFQ',
    'SUBMIT_QUOTATION',
    'EDIT_QUOTATION',
    'TRACK_RFQ_STATUS',
    'VIEW_APPROVED_PO',
    'VIEW_INVOICE_STATUS'
  ],
  manager: [
    'VIEW_REQUESTS',
    'REVIEW_QUOTATIONS',
    'APPROVE_REQUESTS',
    'REJECT_REQUESTS',
    'ADD_REMARKS',
    'VIEW_APPROVAL_HISTORY',
    'MONITOR_WORKFLOW'
  ],
  admin: [
    'MANAGE_USERS',
    'CREATE_USER',
    'EDIT_USER',
    'DELETE_USER',
    'MANAGE_VENDORS',
    'APPROVE_VENDOR',
    'VIEW_ANALYTICS',
    'VIEW_REPORTS',
    'SYSTEM_CONFIG',
    'VIEW_ALL_DATA'
  ]
};

export const ROLE_MAP = {
  BUYER: 'procurement_officer',
  SUPPLIER: 'vendor',
  PROCUREMENT_MANAGER: 'manager',
  ADMIN: 'admin'
};

export const ROLE_DISPLAY_NAMES = {
  procurement_officer: 'Procurement Officer',
  vendor: 'Vendor',
  manager: 'Manager / Approver',
  admin: 'Admin'
};
