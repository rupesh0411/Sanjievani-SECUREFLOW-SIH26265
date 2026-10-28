import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ApprovalRequest } from '../../types';

export const ApprovalsPage: React.FC = () => {
  const { approvalRequests, approveRequest } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedAppr, setSelectedAppr] = useState<ApprovalRequest | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected' | 'returned'>('approved');
  const [decisionComments, setDecisionComments] = useState('');

  const isAuthorizedApprover = currentUser?.role === 'approver' || currentUser?.role === 'admin';

  // Filter requests
  const pendingRequests = approvalRequests.filter(a => a.status === 'pending');
  const approvedRequests = approvalRequests.filter(a => a.status === 'approved');
  const rejectedRequests = approvalRequests.filter(a => a.status === 'rejected' || a.status === 'returned');

  const currentList = 
    activeTab === 'pending' ? pendingRequests :
    activeTab === 'approved' ? approvedRequests :
    activeTab === 'rejected' ? rejectedRequests : approvalRequests;

  const handleOpenDecision = (appr: ApprovalRequest, type: 'approved' | 'rejected' | 'returned') => {
    setSelectedAppr(appr);
    setDecisionType(type);
    setDecisionComments('');
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedAppr) return;
    approveRequest(selectedAppr.id, decisionType, decisionComments);
    setDecisionModalOpen(false);
    setSelectedAppr(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Financial Approval Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal institutional sanction for initial deposits, renewals, and refund releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
            {pendingRequests.length} Dossiers Awaiting Decision
          </span>
        </div>
      </div>

      {/* Role Segregation Notice */}
      {!isAuthorizedApprover && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            You are logged in as <strong>{currentUser?.roleTitle}</strong>. Under Segregation of Duties (SoD) policies, only <strong>Financial Approver (Meenakshi Iyer)</strong> or <strong>Administrator</strong> can sign approval sanctions.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto">
        {[
          { key: 'pending', label: `Pending Approvals (${pendingRequests.length})` },
          { key: 'approved', label: `Approved Sanctions (${approvedRequests.length})` },
          { key: 'rejected', label: `Rejected / Returned (${rejectedRequests.length})` },
          { key: 'all', label: `Complete Archive (${approvalRequests.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Approvals Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Request Ref</th>
                <th className="py-3 px-4 font-bold">Request Type</th>
                <th className="py-3 px-4 font-bold">Institution</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Requested By</th>
                <th className="py-3 px-4 font-bold">Current Stage</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.length > 0 ? (
                currentList.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-navy font-mono">{req.instrumentRef}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{req.id}</span>
                      <p className="text-[10px] text-slate-500">{req.submissionDate}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 capitalize">
                        {req.requestType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {req.institutionName.split('(')[0]}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-black text-navy text-sm">
                        ₹{req.amount.toLocaleString('en-IN')}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="font-medium">{req.requestedBy}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-blue-700 font-semibold capitalize">
                        {req.stage.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'pending' && isAuthorizedApprover ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDecision(req, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDecision(req, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] border border-rose-200"
                          >
                            Reject
                          </button>
                          <Link
                            to={`/dashboard/instruments/${req.instrumentId}`}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Inspect instrument"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
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
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    No requests found in this approval tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedAppr && (
        <Modal
          isOpen={decisionModalOpen}
          onClose={() => setDecisionModalOpen(false)}
          title={`Confirm Financial Sanction Decision`}
          description={`Request: ${selectedAppr.instrumentRef} · Amount: ₹${selectedAppr.amount.toLocaleString('en-IN')}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className={`p-3.5 rounded-xl border ${
              decisionType === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <p className="font-bold">
                Decision: {decisionType.toUpperCase()}
              </p>
              <p className="text-[11px] mt-0.5">
                {decisionType === 'approved'
                  ? 'This action will sanction the request, transition instrument status, and log a permanent authorization audit event.'
                  : 'Please state the official regulatory reason for this decision.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase mb-1">
                Approver Sanction Reason / Notes *
              </label>
              <textarea
                required
                rows={3}
                value={decisionComments}
                onChange={e => setDecisionComments(e.target.value)}
                placeholder="Enter formal sanction note or reason for rejection/return..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-5 py-2 rounded-xl text-white font-bold shadow-xs ${
                  decisionType === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {decisionType.toUpperCase()}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
