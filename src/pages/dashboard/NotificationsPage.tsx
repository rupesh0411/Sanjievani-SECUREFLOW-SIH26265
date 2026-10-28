import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCcw, 
  ArrowUpRight, 
  Check, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const filteredNotifs = notifications.filter(n => {
    const matchesType = filterType === 'all' || n.type === filterType;
    const matchesUnread = !unreadOnly || !n.read;
    return matchesType && matchesUnread;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'maturity_reminder':
        return <Calendar className="w-5 h-5 text-amber-500" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'approval':
        return <ShieldAlert className="w-5 h-5 text-purple-500" />;
      case 'renewal':
        return <RefreshCcw className="w-5 h-5 text-teal-500" />;
      case 'release':
        return <ArrowUpRight className="w-5 h-5 text-cyan-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Notifications & Maturity Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated milestone alerts and workflow dispatch updates.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Threshold Rule Info Box */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Automated Escalation Rule:</strong> SECUREFLOW scans deposit maturity dates every midnight. High-priority alerts trigger at <strong>60, 30, 15, and 7 days</strong> before expiry to safeguard bank claims. In-portal alerts are delivered instantly; simulated SMS/Email notifications are logged to the audit record.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-card">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { key: 'all', label: 'All Alerts' },
            { key: 'maturity_reminder', label: 'Maturity Reminders' },
            { key: 'verification', label: 'Verification' },
            { key: 'approval', label: 'Approvals' },
            { key: 'system', label: 'System Warnings' },
          ].map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterType === f.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 pr-3">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={e => setUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Unread Only</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                !n.read
                  ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${!n.read ? 'text-navy font-extrabold' : 'text-slate-800'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Logged: {n.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id);
                    navigate(n.targetUrl);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors whitespace-nowrap"
                >
                  View Record &rarr;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-12 text-center text-slate-400 text-xs">
            No notifications found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
