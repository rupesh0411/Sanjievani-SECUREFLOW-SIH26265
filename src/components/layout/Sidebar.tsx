import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  CheckSquare,
  ShieldAlert,
  CalendarDays,
  RefreshCw,
  ArrowUpRight,
  FolderLock,
  Bell,
  BarChart3,
  History,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (m: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { currentUser, logout, switchRole, availableUsers } = useAuth();
  const { instruments, approvalRequests, notifications } = useData();
  const location = useLocation();

  // Dynamic badge counts
  const pendingVerificationCount = instruments.filter(i => i.status === 'pending_verification').length;
  const pendingApprovalsCount = approvalRequests.filter(a => a.status === 'pending').length;
  const expiringSoonCount = instruments.filter(i => i.status === 'expiring_soon').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'institution', 'officer', 'approver', 'auditor'],
    },
    {
      label: 'Instrument Registry',
      path: '/dashboard/instruments',
      icon: FileSpreadsheet,
      roles: ['admin', 'institution', 'officer', 'approver', 'auditor'],
      badge: instruments.length,
    },
    {
      label: 'Register Deposit',
      path: '/dashboard/instruments/new',
      icon: PlusCircle,
      roles: ['admin', 'institution'],
      highlight: true,
    },
    {
      label: 'Verification Queue',
      path: '/dashboard/verification',
      icon: CheckSquare,
      roles: ['admin', 'officer'],
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      label: 'Approval Desk',
      path: '/dashboard/approvals',
      icon: ShieldAlert,
      roles: ['admin', 'approver'],
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      label: 'Maturity Calendar',
      path: '/dashboard/maturity',
      icon: CalendarDays,
      roles: ['admin', 'institution', 'officer', 'approver', 'auditor'],
      badge: expiringSoonCount > 0 ? expiringSoonCount : undefined,
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      label: 'Renewals & Replace',
      path: '/dashboard/renewals',
      icon: RefreshCw,
      roles: ['admin', 'institution', 'officer', 'approver'],
    },
    {
      label: 'Release & Refunds',
      path: '/dashboard/releases',
      icon: ArrowUpRight,
      roles: ['admin', 'institution', 'officer', 'approver'],
    },
    {
      label: 'Document Library',
      path: '/dashboard/documents',
      icon: FolderLock,
      roles: ['admin', 'institution', 'officer', 'approver', 'auditor'],
    },
    {
      label: 'Notifications',
      path: '/dashboard/notifications',
      icon: Bell,
      roles: ['admin', 'institution', 'officer', 'approver', 'auditor'],
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'Reports & Analytics',
      path: '/dashboard/reports',
      icon: BarChart3,
      roles: ['admin', 'officer', 'approver', 'auditor'],
    },
    {
      label: 'Audit Trail',
      path: '/dashboard/audit',
      icon: History,
      roles: ['admin', 'officer', 'approver', 'auditor'],
    },
    {
      label: 'User Management',
      path: '/dashboard/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      label: 'System Settings',
      path: '/dashboard/settings',
      icon: Settings,
      roles: ['admin', 'institution', 'auditor'],
    },
  ];

  // Filter items visible to current user's role
  const userRole = currentUser?.role || 'admin';
  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#101C35] text-white border-r border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#0C1527]">
          {!collapsed ? (
            <Logo variant="light" size="sm" withTagline={false} />
          ) : (
            <div className="mx-auto">
              <Logo variant="light" size="sm" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!collapsed && (
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 truncate">
              <UserCheck className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span className="truncate font-medium capitalize">{currentUser?.roleTitle || userRole}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Demo
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isExactActive = location.pathname === item.path;
            const isChildActive = item.path !== '/dashboard' && location.pathname.startsWith(item.path);
            const active = isExactActive || isChildActive;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : item.highlight
                    ? 'text-teal-400 hover:bg-slate-800/70 hover:text-teal-300'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    active ? 'text-white' : item.highlight ? 'text-teal-400' : 'text-slate-400'
                  }`}
                />

                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {/* Badge indicator */}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot badge */}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 ring-2 ring-[#101C35]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Profile & Switcher */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0C1527]">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                  {currentUser?.name.substring(0, 2).toUpperCase() || 'SF'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.department}</p>
                </div>
              </div>

              {/* Quick Switch Role Dropdown */}
              <div className="pt-1">
                <label className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">
                  Switch Demo Persona:
                </label>
                <select
                  value={currentUser?.role}
                  onChange={e => switchRole(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.role}>
                      {u.role.toUpperCase()} — {u.name.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <NavLink to="/" className="hover:text-blue-400 transition-colors">
                  Exit to Website
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs cursor-pointer"
                title={`${currentUser?.name} (${currentUser?.role})`}
              >
                {currentUser?.name.substring(0, 2).toUpperCase() || 'SF'}
              </div>
              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
