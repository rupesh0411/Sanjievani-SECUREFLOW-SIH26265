import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  FileSpreadsheet, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  TrendingUp, 
  PlusCircle, 
  Calendar,
  Building2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  History,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export const DashboardOverview: React.FC = () => {
  const { instruments, approvalRequests, auditEvents, institutions } = useData();
  const { currentUser } = useAuth();

  // Dynamic calculations from underlying dataset
  const totalCount = instruments.length;
  const activeCount = instruments.filter(i => i.status === 'active' || i.status === 'renewed').length;
  const pendingVerificationCount = instruments.filter(i => i.status === 'pending_verification' || i.status === 'under_review').length;
  const expiringSoonCount = instruments.filter(i => i.status === 'expiring_soon').length;
  const expiredCount = instruments.filter(i => i.status === 'expired').length;
  const pendingReleaseCount = instruments.filter(i => i.status === 'release_requested').length;
  const totalAmountPledged = instruments.reduce((sum, item) => sum + item.amount, 0);

  // Status Distribution Data for Pie Chart
  const statusData = [
    { name: 'Active', value: activeCount, color: '#16845B' },
    { name: 'Expiring Soon', value: expiringSoonCount, color: '#D99520' },
    { name: 'Pending Verification', value: pendingVerificationCount, color: '#356AE6' },
    { name: 'Expired', value: expiredCount, color: '#D94F59' },
    { name: 'Release / Renew', value: pendingReleaseCount + instruments.filter(i => i.status === 'renewal_requested' || i.status === 'released').length, color: '#20B8A5' },
  ];

  // Monthly Maturity Timeline Data
  const monthlyTimelineData = [
    { month: 'Oct 2026', count: 3, amountCr: 4.8 },
    { month: 'Nov 2026', count: 4, amountCr: 8.2 },
    { month: 'Dec 2026', count: 2, amountCr: 4.2 },
    { month: 'Jan-Jun 2027', count: 8, amountCr: 17.5 },
    { month: 'Jul-Dec 2027', count: 5, amountCr: 11.0 },
    { month: '2028+', count: 3, amountCr: 5.5 },
  ];

  // Upcoming Maturities List
  const upcomingMaturities = instruments
    .filter(i => i.status === 'expiring_soon' || i.status === 'expired')
    .slice(0, 5);

  // Pending Approvals List
  const pendingApprovals = approvalRequests.filter(a => a.status === 'pending').slice(0, 4);

  // Recent Activity Feed
  const recentEvents = auditEvents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101C35] via-[#192A49] to-[#0C1527] text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>SIH26265 Smart Automation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Financial Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Logged in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.roleTitle}). Centralized repository monitoring across 6 participating public institutions.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/instruments/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Instrument</span>
          </Link>

          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <span>Treasury Report</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Instruments</span>
          <p className="text-xl sm:text-2xl font-black text-navy">{totalCount}</p>
          <span className="text-[10px] font-semibold text-blue-600">
            ₹{(totalAmountPledged / 10000000).toFixed(2)} Cr Pledged
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Deposits</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Valid & Pledged</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verification Queue</span>
          <p className="text-xl sm:text-2xl font-black text-blue-600">{pendingVerificationCount}</p>
          <span className="text-[10px] text-blue-700 font-medium">Awaiting Officer</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expiring &lt;30 Days</span>
          <p className="text-xl sm:text-2xl font-black text-amber-600">{expiringSoonCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Action Required</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expired / Due</span>
          <p className="text-xl sm:text-2xl font-black text-rose-600">{expiredCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">Overdue Notice</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Release Claims</span>
          <p className="text-xl sm:text-2xl font-black text-teal-600">{pendingReleaseCount}</p>
          <span className="text-[10px] text-teal-700 font-medium">Refund Requests</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy">Instrument Status Distribution</h3>
              <p className="text-[11px] text-slate-500">Breakdown of portfolio by workflow state</p>
            </div>
            <Link to="/dashboard/instruments" className="text-xs text-blue-600 font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val} Instruments`, 'Count']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Maturity Timeline Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy">Monthly Maturity Horizon</h3>
              <p className="text-[11px] text-slate-500">Upcoming deposit maturity schedule (Value in ₹ Crores)</p>
            </div>
            <Link to="/dashboard/maturity" className="text-xs text-blue-600 font-semibold hover:underline">
              Calendar &rarr;
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTimelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(val: any, name: any) => [name === 'amountCr' ? `₹${val} Cr` : val, name === 'amountCr' ? 'Total Value' : 'Deposit Count']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="amountCr" fill="#356AE6" radius={[6, 6, 0, 0]} name="amountCr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Maturities & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Maturities Table */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-navy">Upcoming & Expired Maturities</h3>
            </div>
            <Link to="/dashboard/maturity" className="text-xs font-semibold text-blue-600 hover:underline">
              Full Calendar &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Instrument</th>
                  <th className="py-2.5 px-3">Bank</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Maturity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingMaturities.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-navy">{item.referenceNumber}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.vendorName}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.bankName}</td>
                    <td className="py-3 px-3 font-bold text-navy">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {item.maturityDate}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/dashboard/instruments/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals & Quick Actions */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-navy">Pending Approval Dossiers</h3>
            </div>
            <Link to="/dashboard/approvals" className="text-xs font-semibold text-blue-600 hover:underline">
              Approval Desk &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map(appr => (
              <div
                key={appr.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy">{appr.instrumentRef}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 capitalize">
                    {appr.requestType.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{appr.institutionName.split('(')[0]}</span>
                  <span className="font-bold text-blue-600">₹{appr.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">By {appr.requestedBy}</span>
                  <Link
                    to="/dashboard/approvals"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Review Sanction &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Activity Audit Snippet */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Live System Audit Feed
              </span>
              <Link to="/dashboard/audit" className="text-blue-600 hover:underline text-[11px]">
                Full Trail
              </Link>
            </div>

            <div className="space-y-1.5">
              {recentEvents.map(ev => (
                <div key={ev.id} className="flex items-start justify-between text-[11px] text-slate-600 py-1 border-b border-slate-50 last:border-0">
                  <div className="truncate pr-2">
                    <strong className="text-navy">{ev.actor.split(' ')[0]}</strong>: {ev.action.replace(/_/g, ' ')}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{ev.timestamp.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
