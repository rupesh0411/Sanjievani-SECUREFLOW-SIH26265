import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Eye, 
  FileText, 
  Check, 
  Building2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ReleaseRequest } from '../../types';

export const ReleasesPage: React.FC = () => {
  const { releaseRequests, executeRelease } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'under_review' | 'released'>('all');
  const [selectedRel, setSelectedRel] = useState<ReleaseRequest | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [bankRefCode, setBankRefCode] = useState('');

  const isFinanceOfficer = currentUser?.role === 'approver' || currentUser?.role === 'admin' || currentUser?.role === 'officer';

  const filtered = releaseRequests.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const handleOpenConfirm = (rel: ReleaseRequest) => {
    setSelectedRel(rel);
    setBankRefCode(`BANK-REL-${Date.now().toString().slice(-6)}`);
    setConfirmModalOpen(true);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRel || !bankRefCode) return;
    executeRelease(selectedRel.id, bankRefCode);
    setConfirmModalOpen(false);
    setSelectedRel(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Release & Refund Settlement Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            4-stage discharge workflow: Request → Review → Approval → Bank Release Record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
            {releaseRequests.filter(r => r.status === 'under_review').length} Under Review
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto">
        {[
          { key: 'all', label: `All Release Requests (${releaseRequests.length})` },
          { key: 'under_review', label: 'Under Review' },
          { key: 'released', label: 'Released & Disbursed' },
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

      {/* Release Requests Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Instrument Ref</th>
                <th className="py-3 px-4 font-bold">Contractor Entity</th>
                <th className="py-3 px-4 font-bold">Original Deposit</th>
                <th className="py-3 px-4 font-bold">Completion Status</th>
                <th className="py-3 px-4 font-bold">Net Refund Amount</th>
                <th className="py-3 px-4 font-bold">Release Status</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-navy font-mono">{req.instrumentRef}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{req.id}</span>
                      <p className="text-[10px] text-slate-500">Date: {req.requestDate}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{req.vendorName}</p>
                      <p className="text-[10px] text-slate-400">{req.institutionName.split('(')[0]}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      ₹{req.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        {req.contractCompletionStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-black text-emerald-700 text-sm">
                        ₹{req.netRefundAmount.toLocaleString('en-IN')}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          req.status === 'released'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'under_review' && isFinanceOfficer ? (
                        <button
                          type="button"
                          onClick={() => handleOpenConfirm(req)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Confirm Disbursal
                        </button>
                      ) : (
                        <Link
                          to={`/dashboard/instruments/${req.instrumentId}`}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          View Record
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No release requests found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Disbursal Modal */}
      {selectedRel && (
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title={`Confirm Release Disbursal`}
          description={`Record official bank discharge code for ${selectedRel.instrumentRef} (Net Refund: ₹${selectedRel.netRefundAmount.toLocaleString('en-IN')})`}
          maxWidth="md"
        >
          <form onSubmit={handleExecute} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <span className="font-bold">Treasury & Bank Cleared Action</span>
              <p className="text-[11px] leading-relaxed">
                Confirming disbursal records that the issuing bank has discharged the institutional lien and dispatched the refund voucher to <strong>{selectedRel.vendorName}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase mb-1">
                Bank Advice / SFMS Clearing Reference *
              </label>
              <input
                type="text"
                required
                value={bankRefCode}
                onChange={e => setBankRefCode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono font-bold"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                Confirm Release & Archive
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
