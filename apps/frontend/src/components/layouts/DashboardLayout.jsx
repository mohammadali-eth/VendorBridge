import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROLE_MAP, ROLE_DISPLAY_NAMES } from '../../config/rbac';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  Shield,
  FileSpreadsheet,
  Receipt,
  Bell,
  Search,
  CheckSquare,
  History,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationPanel from '../activity/NotificationPanel';
import activityService from '../../services/activityService';

export default function DashboardLayout() {
  const { user, logout, setTestingRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const loadNotifications = async () => {
    try {
      const data = await activityService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await activityService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await activityService.markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotification = async (id) => {
    try {
      await activityService.clearNotification(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeRoleKey = ROLE_MAP[user?.role] || user?.role || 'procurement_officer';

  const getFilteredNavItems = () => {
    if (activeRoleKey === 'procurement_officer') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Vendor Management', path: '/vendors', icon: Users },
        { name: 'RFQ Management', path: '/rfq', icon: FileText },
        { name: 'Quotation Comparison', path: '/quotations', icon: ClipboardList },
        { name: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet },
        { name: 'Invoices', path: '/invoices', icon: Receipt },
        { name: 'Activity Logs', path: '/activity-logs', icon: History },
      ];
    }
    if (activeRoleKey === 'vendor') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Assigned RFQs', path: '/rfq', icon: FileText },
        { name: 'My Quotations', path: '/quotations', icon: ClipboardList },
        { name: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet },
        { name: 'Invoice Status', path: '/invoices', icon: Receipt },
        { name: 'Activity Logs', path: '/activity-logs', icon: History },
      ];
    }
    if (activeRoleKey === 'manager') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Approval Workflow', path: '/approvals', icon: CheckSquare },
        { name: 'Procurement Monitoring', path: '/purchase-orders', icon: FileSpreadsheet },
        { name: 'Activity Logs', path: '/activity-logs', icon: History },
      ];
    }
    if (activeRoleKey === 'admin') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/users', icon: Users },
        { name: 'Vendor Management', path: '/vendors', icon: Users },
        { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
        { name: 'Activity Logs', path: '/activity-logs', icon: History },
        { name: 'System Settings', path: '/settings', icon: Settings },
      ];
    }
    return [];
  };

  const navItems = getFilteredNavItems();

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-[#1e141c] text-slate-300 border-r border-[#E5E7EB] flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`h-16 flex items-center justify-between px-4 border-b border-white/5 ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 pl-2">
              <Shield className="h-6 w-6 text-[#A87D9F] shrink-0" />
              <span className="font-bold text-lg tracking-wider text-white">VendorBridge</span>
            </div>
          )}
          {isSidebarCollapsed && <Shield className="h-6 w-6 text-[#A87D9F] shrink-0" />}
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={`p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'mt-1' : ''
            }`}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard' || location.pathname.endsWith('/dashboard')
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isSidebarCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive
                    ? 'bg-[#714B67] text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 w-full py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8">
          {/* Header Left: Title or Search */}
          <div className="flex items-center gap-6 flex-1 max-w-md">
            <h1 className="font-bold text-lg text-[#111827] hidden md:block">
              {navItems.find((i) => {
                if (i.path === '/dashboard') return location.pathname.endsWith('/dashboard');
                return location.pathname.startsWith(i.path);
              })?.name || 'Portal'}
            </h1>
            <div className="relative w-full text-slate-400 focus-within:text-[#714B67]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} />
              </div>
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Header Right: Notifications & Profile */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="relative p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A87D9F] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#714B67]"></span>
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[#111827]">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-500 font-medium capitalize">
                    {ROLE_DISPLAY_NAMES[activeRoleKey] || activeRoleKey}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-[#F5EEF4] border border-[#A87D9F]/20 text-[#714B67] flex items-center justify-center font-bold uppercase text-sm">
                  {user?.name?.[0] || 'U'}
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-40">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* TEMPORARY ROLE SWITCHER FOR DEVELOPMENT TESTING */}
            {/* REMOVE BEFORE PRODUCTION RELEASE */}
            <div className="flex items-center gap-3 border border-dashed border-[#A87D9F] bg-[#fdfafc] rounded-xl px-3 py-1.5 shrink-0 select-none">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black text-[#714B67] tracking-wider uppercase">
                  TEST MODE
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-tight mt-0.5">
                  Current Role:{' '}
                  <span className="font-bold text-[#714B67]">
                    {ROLE_DISPLAY_NAMES[activeRoleKey] || activeRoleKey}
                  </span>
                </span>
              </div>
              <select
                value={user?.role || 'BUYER'}
                onChange={(e) => setTestingRole(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer border-l border-slate-200 pl-2 ml-1"
              >
                <option value="BUYER">Procurement Officer</option>
                <option value="SUPPLIER">Vendor</option>
                <option value="PROCUREMENT_MANAGER">Manager / Approver</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>

      {/* Shared Slide-out Notification Drawer */}
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClear={handleClearNotification}
      />
    </div>
  );
}
