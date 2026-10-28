import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  RefreshCcw, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { RenewalRequest } from '../../types';

export const RenewalsPage: React.FC = () => {
  const { renewalRequests, approveRequest, approvalRequests } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'under_review' | 'completed'>('all');

  const filtered = renewalRequests.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Renewals & Replacement Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track deposit tenure extensions while preserving original instrument audit history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
            {renewalRequests.filter(r => r.status === 'under_review').length} Renewals Under Review
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto">
        {[
          { key: 'all', label: `All Renewals (${renewalRequests.length})` },
          { key: 'under_review', label: 'Under Review' },
          { key: 'completed', label: 'Completed & Active' },
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Renewals Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Instrument Ref</th>
                <th className="py-3 px-4 font-bold">Institution</th>
                <th className="py-3 px-4 font-bold">Original Maturity</th>
                <th className="py-3 px-4 font-bold">Proposed Extended Date</th>
                <th className="py-3 px-4 font-bold">Replacement Doc</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-navy font-mono">{item.instrumentRef}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      <p className="text-[10px] text-slate-500">Requested: {item.requestDate}</p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.institutionName.split('(')[0]}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {item.originalMaturityDate}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-teal-700 font-mono">
                      {item.proposedMaturityDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{item.replacementDocName || 'Endorsement.pdf'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          item.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/dashboard/instruments/${item.instrumentId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No renewal requests found in this view.
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
