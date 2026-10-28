import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ChevronRight, Home, Info, RotateCcw } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { resetDemoData } = useData();

  // Generate dynamic breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const getBreadcrumbName = (part: string, idx: number) => {
    if (part === 'dashboard' && idx === 0) return 'Dashboard';
    if (part === 'instruments') return 'Instrument Registry';
    if (part === 'new') return 'New Registration';
    if (part === 'verification') return 'Verification Queue';
    if (part === 'approvals') return 'Approval Management';
    if (part === 'maturity') return 'Maturity Calendar';
    if (part === 'renewals') return 'Renewals & Replacement';
    if (part === 'releases') return 'Release & Refund Requests';
    if (part === 'documents') return 'Document Management';
    if (part === 'notifications') return 'Notifications';
    if (part === 'reports') return 'Reports & Analytics';
    if (part === 'audit') return 'Audit Trail';
    if (part === 'users') return 'User Management';
    if (part === 'settings') return 'System Settings';
    if (part.startsWith('SEC-')) return part;
    return part.replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Topbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

        {/* Breadcrumb Navigation Bar */}
        <div className="bg-white border-b border-app-border px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <nav className="flex items-center space-x-1.5 text-slate-500 overflow-x-auto whitespace-nowrap py-0.5">
            <Link
              to="/dashboard"
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {pathParts.map((part, index) => {
              const routeTo = `/${pathParts.slice(0, index + 1).join('/')}`;
              const isLast = index === pathParts.length - 1;
              const name = getBreadcrumbName(part, index);

              if (part === 'dashboard' && index === 0) return null;

              return (
                <React.Fragment key={routeTo}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {isLast ? (
                    <span className="font-semibold text-navy capitalize truncate max-w-[200px]">
                      {name}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="hover:text-blue-600 capitalize transition-colors"
                    >
                      {name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Quick Demo Reset Trigger */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset SECUREFLOW demo data to original 25 records and mock audit logs?')) {
                resetDemoData();
              }
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="Reset dataset back to fresh demo state"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Page View Slot */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Compact Demo Notice Footer */}
        <footer className="px-6 py-3 border-t border-app-border text-[11px] text-slate-400 bg-white/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SECUREFLOW Live State Engine · SIH26265 Prototype</span>
          </div>
          <div>
            Team Sanjievani · Smart India Hackathon 2026
          </div>
        </footer>
      </div>
    </div>
  );
};
