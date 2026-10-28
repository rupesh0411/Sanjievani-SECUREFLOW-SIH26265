import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter
} from 'lucide-react';
import { Instrument } from '../../types';

export const VerificationQueue: React.FC = () => {
  const { instruments, verifyInstrument } = useData();
  const { currentUser } = useAuth();

  const [activeQueue, setActiveQueue] = useState<'pending' | 'assigned' | 'returned' | 'completed'>('pending');
  const [selectedInst, setSelectedInst] = useState<Instrument | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    physicalDocumentVerified: true,
    bankBranchMatches: true,
    validAmountAndPledge: true,
    tenureMatchesTender: true,
    noPriorLienNotice: true,
  });
  const [officerNotes, setOfficerNotes] = useState('');

  // Queue categorizations
  const pendingItems = instruments.filter(i => i.status === 'pending_verification' || i.status === 'under_review');
  const assignedToMe = instruments.filter(i => (i.status === 'pending_verification' || i.status === 'under_review') && i.assignedOfficerId === currentUser?.id);
  const returnedItems = instruments.filter(i => i.status === 'returned_for_correction');
  const completedItems = instruments.filter(i => i.status === 'pending_approval' || i.status === 'active' || i.status === 'renewed');

  const currentItems = 
    activeQueue === 'pending' ? pendingItems :
    activeQueue === 'assigned' ? assignedToMe :
    activeQueue === 'returned' ? returnedItems : completedItems;

  const handleOpenReview = (inst: Instrument) => {
    setSelectedInst(inst);
    setOfficerNotes('');
    setReviewModalOpen(true);
  };

  const handleExecuteDecision = (decision: 'verified' | 'returned_for_correction' | 'rejected') => {
    if (!selectedInst) return;
    verifyInstrument(selectedInst.id, decision, checklist, officerNotes || 'Checklist completed by officer.');
    setReviewModalOpen(false);
    setSelectedInst(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Verification Queue & Review Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            5-point statutory document verification under DoE Procurement Manual 2024.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
            {pendingItems.length} In Pending Queue
          </span>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto">
        {[
          { key: 'pending', label: `Pending Verification (${pendingItems.length})` },
          { key: 'assigned', label: `Assigned to Me (${assignedToMe.length})` },
          { key: 'returned', label: `Returned for Correction (${returnedItems.length})` },
          { key: 'completed', label: `Cleared / Verified (${completedItems.length})` },
        ].map(q => (
          <button
            key={q.key}
            type="button"
            onClick={() => setActiveQueue(q.key as any)}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeQueue === q.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Instrument Reference</th>
                <th className="py-3 px-4 font-bold">Institution & Vendor</th>
                <th className="py-3 px-4 font-bold">Bank & Branch</th>
                <th className="py-3 px-4 font-bold">Pledged Amount</th>
                <th className="py-3 px-4 font-bold">Documents Attached</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-navy font-mono">{item.referenceNumber}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      <p className="text-[11px] text-slate-500">{item.type.split('(')[0]}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{item.institutionName.split('(')[0]}</p>
                      <p className="text-[11px] text-slate-500">{item.vendorName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{item.bankName}</p>
                      <p className="text-[10px] text-blue-600 font-mono">IFSC: {item.ifscCode}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-black text-navy text-sm">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">Due {item.maturityDate}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.documents.length} Files</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {activeQueue === 'pending' || activeQueue === 'assigned' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-2xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      ) : (
                        <Link
                          to={`/dashboard/instruments/${item.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No items currently in this queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedInst && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Verification Review: ${selectedInst.referenceNumber}`}
          description={`Value: ₹${selectedInst.amount.toLocaleString('en-IN')} · Pledged by ${selectedInst.vendorName} to ${selectedInst.institutionName}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Attached documents preview section */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                Attached Digital Certificate
              </span>
              {selectedInst.documents.map(d => (
                <div key={d.id} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium truncate max-w-[280px]">{d.name} ({d.fileSize})</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SHA-256 Validated
                  </span>
                </div>
              ))}
            </div>

            {/* Checklist items */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                5-Point Statutory Verification Checklist
              </span>

              {[
                { key: 'physicalDocumentVerified', label: '1. Original Physical Receipt & Branch Stamp Legitimacy Verified' },
                { key: 'bankBranchMatches', label: `2. Bank Branch IFSC (${selectedInst.ifscCode}) Verified against RBI Master Directory` },
                { key: 'validAmountAndPledge', label: '3. Full Amount Pledged to Institutional Accounts Officer' },
                { key: 'tenureMatchesTender', label: `4. Tenure Complies with Contract (+60-day buffer beyond ${selectedInst.maturityDate})` },
                { key: 'noPriorLienNotice', label: '5. Clean Title: No Prior Lien or Judicial Encumbrance Reported' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(checklist as any)[item.key]}
                    onChange={e => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 mt-0.5"
                  />
                  <span className="font-semibold text-slate-800">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Officer Notes */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase mb-1">
                Verification Officer Notes / Findings *
              </label>
              <textarea
                rows={3}
                value={officerNotes}
                onChange={e => setOfficerNotes(e.target.value)}
                placeholder="Confirm bank verification code, branch confirmation letter number, or state reason for return..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleExecuteDecision('returned_for_correction')}
                className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 font-bold hover:bg-amber-100"
              >
                Return for Correction
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExecuteDecision('rejected')}
                  className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 font-bold hover:bg-rose-100"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteDecision('verified')}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Sign & Verify Forward
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
