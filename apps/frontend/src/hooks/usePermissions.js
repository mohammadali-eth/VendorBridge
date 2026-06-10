import { useAuthStore } from '../store/auth.store';
import { ROLE_PERMISSIONS, ROLE_MAP } from '../config/rbac';

export function usePermissions() {
  const { role: rawRole } = useAuthStore();
  const role = ROLE_MAP[rawRole] || rawRole;

  const hasPermission = (permission) => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const hasRole = (checkRole) => {
    return role === checkRole;
  };

  const canAccess = (route) => {
    // Map of routes to their required roles
    const routePermissions = {
      '/vendors': ['admin', 'procurement_officer'],
      '/rfq': ['procurement_officer', 'vendor'],
      '/rfqs': ['procurement_officer', 'vendor'],
      '/procurement/comparison': ['procurement_officer'],
      '/vendor/quotation': ['vendor'],
      '/quotations': ['vendor'],
      '/approvals': ['manager'],
      '/purchase-orders': ['procurement_officer', 'vendor', 'manager'],
      '/invoices': ['procurement_officer', 'vendor', 'manager'],
      '/reports': ['admin'],
      '/users': ['admin'],
      '/settings': ['admin', 'procurement_officer'],
    };

    // Find if the route starts with any protected prefix
    const matchedPrefix = Object.keys(routePermissions).find((prefix) => route.startsWith(prefix));

    if (!matchedPrefix) return true; // Public or default access
    return routePermissions[matchedPrefix].includes(role);
  };

  return {
    hasPermission,
    hasRole,
    canAccess,
    activeRole: role,
  };
}
