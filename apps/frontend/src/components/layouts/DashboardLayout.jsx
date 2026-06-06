import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LayoutDashboard, Users, FileText, ClipboardList, Settings, LogOut, Shield } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vendors', path: '/vendors', icon: Users, roles: ['ADMIN', 'PROCUREMENT_MANAGER'] },
    { name: 'RFQs', path: '/rfq', icon: FileText },
    { name: 'Quotations', path: '/quotations', icon: ClipboardList },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e141c] text-slate-300 border-r border-[#E5E7EB] flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <Shield className="h-6 w-6 text-[#A87D9F]" />
          <span className="font-bold text-lg tracking-wider text-white">VendorBridge</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const Icon = item.icon;
            
            // Check active route matches
            const isActive = item.path === '/dashboard' 
              ? location.pathname === '/dashboard' || location.pathname.endsWith('/dashboard')
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#714B67] text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8">
          <h1 className="font-bold text-lg text-[#111827]">
            {navItems.find((i) => {
              if (i.path === '/dashboard') return location.pathname.endsWith('/dashboard');
              return location.pathname.startsWith(i.path);
            })?.name || 'Portal'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#111827]">{user?.name || 'Guest'}</p>
              <p className="text-xs text-slate-500 font-medium capitalize">
                {user?.role?.toLowerCase()?.replace('_', ' ') || 'Role'}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#714B67] flex items-center justify-center font-bold text-white uppercase text-sm">
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
