import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  Bell, 
  Menu, 
  Calendar, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  X,
  FileText
} from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const { currentUser, switchRole, availableUsers, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, instruments } = useData();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? instruments.filter(
        i =>
          i.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-app-border flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Mobile Menu & Global Search Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-navy rounded-lg hover:bg-slate-100"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search Bar */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs border border-slate-200/60 transition-colors w-48 sm:w-64"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search instruments, banks...</span>
            <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-300 text-slate-400 font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Section: Date, Notifications, Demo Persona, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Calendar Date Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDateFormatted}</span>
          </div>

          {/* Persona Switcher Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-50/70 border border-blue-200/80 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Role:</span>
            <select
              value={currentUser?.role}
              onChange={e => switchRole(e.target.value as any)}
              className="bg-transparent text-blue-900 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {availableUsers.map(u => (
                <option key={u.id} value={u.role}>
                  {u.role.toUpperCase()} ({u.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3 border-b border-app-border bg-slate-50">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-navy uppercase tracking-wider">Maturity & Alerts</h4>
                    {unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setNotifDropdownOpen(false);
                        navigate(n.targetUrl);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800 line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp.split(' ')[1]}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-app-border bg-slate-50 text-center">
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View All Notifications &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#356AE6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentUser?.name.substring(0, 2).toUpperCase() || 'SF'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-xs text-navy">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 capitalize">
                    {currentUser?.roleTitle}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    Account Settings & Policies
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    SIH26265 Documentation
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-navy-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-app-border overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3 border-b border-app-border">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                autoFocus
                placeholder="Search instrument ID, bank, contractor, or ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm text-navy placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {searchResults.map(res => (
                      <div
                        key={res.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          navigate(`/dashboard/instruments/${res.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-navy">{res.referenceNumber}</span>
                          <span className="text-[11px] font-semibold text-blue-600">
                            ₹{res.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {res.bankName} · {res.vendorName} · {res.institutionName}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No matching instruments found for "{searchQuery}".
                  </p>
                )
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-400">
                    Type a reference number (e.g. "SBI", "HDFC"), vendor, or amount to search instantly.
                  </p>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-app-border bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border">Esc</kbd> to close</span>
              <span>Quick jump to Instrument Details</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
