import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock,
  User
} from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const { auditEvents } = useData();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    return auditEvents.filter(ev => {
      const q = search.toLowerCase();
      const matchesSearch = !q || (
        ev.actor.toLowerCase().includes(q) ||
        ev.action.toLowerCase().includes(q) ||
        ev.entityId.toLowerCase().includes(q) ||
        (ev.reason && ev.reason.toLowerCase().includes(q))
      );
      const matchesAction = actionFilter === 'all' || ev.action === actionFilter;
      const matchesResult = resultFilter === 'all' || ev.result === resultFilter;
      return matchesSearch && matchesAction && matchesResult;
    });
  }, [auditEvents, search, actionFilter, resultFilter]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `SECUREFLOW_Audit_Export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all logins, uploads, verification decisions, and sanctions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Audit Policy Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs flex items-start gap-3 border border-slate-800 shadow-md">
        <Lock className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            Statutory Integrity Verification: Append-Only Audit Stream
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Audit entries cannot be modified or deleted. Each record binds the authenticated actor, authorized role, target entity, timestamp, IP address, and stated justification under Central Vigilance Commission guidelines.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search actor, action, entity ID, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium cursor-pointer"
          >
            <option value="all">All Action Types</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="INSTRUMENT_REGISTERED">Instrument Registrations</option>
            <option value="DOCUMENT_UPLOADED">Document Uploads</option>
            <option value="VERIFICATION_APPROVED">Verification Clearances</option>
            <option value="APPROVAL_GRANTED">Sanctions Granted</option>
            <option value="RENEWAL_REQUESTED">Renewal Requests</option>
            <option value="RELEASE_AUTHORIZED">Release Authorizations</option>
          </select>

          <select
            value={resultFilter}
            onChange={e => setResultFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium cursor-pointer"
          >
            <option value="all">All Results</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Timestamp & ID</th>
                <th className="py-3 px-4 font-bold">Actor & Role</th>
                <th className="py-3 px-4 font-bold">Action</th>
                <th className="py-3 px-4 font-bold">Target Entity</th>
                <th className="py-3 px-4 font-bold">Result</th>
                <th className="py-3 px-4 font-bold">Rationale / Details</th>
                <th className="py-3 px-4 text-right font-bold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-navy">{ev.timestamp}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{ev.actor}</p>
                      <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">
                        {ev.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-navy">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {ev.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{ev.entity}</p>
                      <span className="text-[10px] font-mono text-slate-500">{ev.entityId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ev.result === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : ev.result === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {ev.result}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <p className="truncate" title={ev.reason}>{ev.reason || 'No stated reason'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {ev.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No matching audit events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
