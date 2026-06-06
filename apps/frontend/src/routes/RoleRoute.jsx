import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#111827]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Verifying permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
