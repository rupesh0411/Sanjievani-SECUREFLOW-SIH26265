import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Upload, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCcw, 
  ArrowUpRight, 
  History, 
  ChevronLeft,
  XCircle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const InstrumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getInstrumentById, 
    verifyInstrument, 
    approveRequest, 
    requestRenewal, 
    requestRelease, 
    uploadDocument,
    approvalRequests,
    auditEvents 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const instrument = getInstrumentById(id || '');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'verification' | 'timeline' | 'audit'>('overview');

  // Modals state
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    physicalDocumentVerified: true,
    bankBranchMatches: true,
    validAmountAndPledge: true,
    tenureMatchesTender: true,
    noPriorLienNotice: true,
  });
  const [verificationNotes, setVerificationNotes] = useState('');

  // Renewal form state
  const [proposedDate, setProposedDate] = useState('');
  const [renewalReason, setRenewalReason] = useState('');

  // Release form state
  const [releaseReason, setReleaseReason] = useState('Contract completed satisfactorily with no pending liabilities.');
  const [contractStatus, setContractStatus] = useState<'fully_completed' | 'partially_completed' | 'deduction_applied'>('fully_completed');
  const [deductionAmount, setDeductionAmount] = useState('0');

  // Upload Doc form state
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'bank_letter' | 'renewal_endorsement' | 'release_claim'>('bank_letter');

  if (!instrument) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-navy">Instrument Not Found</h2>
        <p className="text-xs text-slate-500">Record "{id}" does not exist or has been removed.</p>
        <Link to="/dashboard/instruments" className="text-xs font-bold text-blue-600 hover:underline">
          &larr; Back to Registry
        </Link>
      </div>
    );
  }

  // Related Audit Events
  const relatedAudits = auditEvents.filter(a => a.entityId === instrument.id);

  // Handlers
  const handleVerifySubmit = (decision: 'verified' | 'returned_for_correction' | 'rejected') => {
    verifyInstrument(instrument.id, decision, checklist, verificationNotes);
    setVerifyModalOpen(false);
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedDate || !renewalReason) return;
    requestRenewal(instrument.id, proposedDate, renewalReason);
    setRenewModalOpen(false);
  };

  const handleReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const netAmount = Math.max(instrument.amount - Number(deductionAmount || 0), 0);
    requestRelease(instrument.id, releaseReason, contractStatus, netAmount);
    setReleaseModalOpen(false);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    uploadDocument(instrument.id, {
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      category: newDocCategory,
      categoryLabel: newDocCategory.replace(/_/g, ' ').toUpperCase(),
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      uploadedBy: currentUser?.name || 'Officer',
      verificationStatus: 'unverified',
    });
    setNewDocName('');
    setUploadDocModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button and Record Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard/instruments"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Registry</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-navy font-mono">
              {instrument.referenceNumber}
            </h1>
            <StatusBadge status={instrument.status} size="md" />
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
              ID: {instrument.id}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {instrument.vendorName} · {instrument.institutionName}
          </p>
        </div>

        {/* Contextual Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Officer Verification Button */}
          {(currentUser?.role === 'officer' || currentUser?.role === 'admin') && 
           (instrument.status === 'pending_verification' || instrument.status === 'under_review') && (
            <button
              type="button"
              onClick={() => setVerifyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Checklist</span>
            </button>
          )}

          {/* Renewal Button */}
          {instrument.status !== 'released' && instrument.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => setRenewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-teal-600" />
              <span>Request Renewal</span>
            </button>
          )}

          {/* Release / Refund Button */}
          {(instrument.status === 'active' || instrument.status === 'expiring_soon' || instrument.status === 'expired') && (
            <button
              type="button"
              onClick={() => setReleaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
              <span>Initiate Release</span>
            </button>
          )}

          {/* Print Certificate */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Print Record Slip"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'documents', label: `Documents (${instrument.documents.length})` },
          { key: 'verification', label: 'Verification Dossier' },
          { key: 'timeline', label: 'Lifecycle Timeline' },
          { key: 'audit', label: `Audit Log (${relatedAudits.length})` },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tender Purpose</span>
              <p className="text-sm font-semibold text-navy mt-1 leading-relaxed">
                {instrument.purpose}
              </p>
              {instrument.contractRef && (
                <p className="text-xs text-blue-600 font-mono mt-1">
                  Contract Ref: {instrument.contractRef}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Pledged Value</span>
                <p className="text-xl font-black text-blue-600 mt-0.5">
                  ₹{instrument.amount.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-400">{instrument.currency}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Instrument Type</span>
                <p className="text-sm font-bold text-navy mt-1">{instrument.type}</p>
                {instrument.interestRate && (
                  <p className="text-[11px] text-emerald-600 font-semibold">{instrument.interestRate}% interest p.a.</p>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Maturity Horizon</span>
                <p className="text-sm font-bold text-rose-700 mt-1">{instrument.maturityDate}</p>
                <p className="text-[10px] text-slate-400">Issued: {instrument.issueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Issuing Bank & Branch</span>
                <p className="text-xs font-bold text-navy">{instrument.bankName}</p>
                <p className="text-[11px] text-slate-500">{instrument.branchName}</p>
                <p className="text-[11px] text-blue-600 font-mono">IFSC: {instrument.ifscCode}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Contractor / Vendor</span>
                <p className="text-xs font-bold text-navy">{instrument.vendorName}</p>
                <p className="text-[11px] text-slate-500">Auto-Renewal Clause: {instrument.autoRenew ? 'Mandated' : 'Manual'}</p>
                <p className="text-[11px] text-slate-500">Historical Extensions: {instrument.renewalCount} Times</p>
              </div>
            </div>
          </div>

          {/* Side Stakeholder & Status Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Governance & Ownership
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Procuring Institution</span>
                  <p className="font-bold text-navy">{instrument.institutionName}</p>
                  <p className="text-slate-500 text-[11px]">{instrument.department}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Verification Officer</span>
                  <p className="font-bold text-navy">{instrument.assignedOfficerName || 'Vikramaditya Verma'}</p>
                  <p className="text-slate-500 text-[11px]">Senior Verification Officer · Treasury Cell</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Sanctioning Approver</span>
                  <p className="font-bold text-navy">{instrument.assignedApproverName || 'Meenakshi Iyer'}</p>
                  <p className="text-slate-500 text-[11px]">Joint Financial Controller (JFC)</p>
                </div>
              </div>
            </div>

            {/* Quick Document Summary */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-2.5 text-xs">
              <span className="font-bold text-navy flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Attached Certificates:
              </span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                {instrument.documents.map(d => (
                  <li key={d.id} className="flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{d.name}</span>
                    <span className="text-emerald-700 font-semibold">{d.fileSize}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-navy">Supporting Document Repository</h2>
              <p className="text-xs text-slate-500">Encrypted digital file storage with version history and integrity checksums.</p>
            </div>

            <button
              type="button"
              onClick={() => setUploadDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {instrument.documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-navy text-sm">{doc.name}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        v{doc.version}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Category: <strong>{doc.categoryLabel}</strong> · Size: {doc.fileSize} · Uploaded: {doc.uploadedAt} by {doc.uploadedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    SHA-256 Validated
                  </span>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Simulated secure download for ${doc.name}. Document verified against internal tamper-proof storage.`);
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600"
                    title="Download Copy"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION DOSSIER */}
      {activeTab === 'verification' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-navy">5-Point Statutory Verification Dossier</h2>
            <p className="text-xs text-slate-500">Verification standards prescribed by DoE Manual for Procurement of Goods 2024.</p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="space-y-3">
              {[
                { label: '1. Original Physical Receipt & Branch Stamp Integrity Check', desc: 'Verified against issuing branch stamp and physical signature ledger' },
                { label: '2. IFSC Code & Bank Branch Cross-Match', desc: `Matched with RBI directory for ${instrument.bankName} (${instrument.ifscCode})` },
                { label: '3. Valid Amount Pledged to Institutional Accounts Officer', desc: `Pledged in favor of Accounts Officer, ${instrument.institutionName}` },
                { label: '4. Tenure Matches Tender Condition (+60 Days beyond DLP)', desc: `Maturity date (${instrument.maturityDate}) covers contractual Defect Liability Period` },
                { label: '5. Absence of Prior Lien / Encumbrance Notice', desc: 'No prior claim or judicial freeze on the underlying fixed deposit' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-navy">{item.label}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
              <span className="font-bold text-blue-900">Officer Certification Note:</span>
              <p className="text-blue-800 leading-relaxed">
                "Verified physical fixed deposit document and bank lien advice. Branch confirmation reference received. Tender reference checked against GeM contract conditions."
              </p>
              <p className="text-[10px] text-blue-600 font-semibold pt-1">
                Signed by: Vikramaditya Verma (Senior Verification Officer)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIFECYCLE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-navy">Lifecycle Progression Timeline</h2>
            <p className="text-xs text-slate-500">Sequential audit of all milestones from registration to release.</p>
          </div>

          <div className="relative pl-8 space-y-8 border-l-2 border-blue-200 py-2">
            <div className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
              <p className="text-xs font-bold text-navy">Deposit Registered & Lodged</p>
              <p className="text-[11px] text-slate-500">Date: {instrument.issueDate} · Initial deposit parameters recorded</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
              <p className="text-xs font-bold text-navy">Verification Officer Checklist Cleared</p>
              <p className="text-[11px] text-slate-500">Signed by Vikramaditya Verma · 5-point statutory checklist satisfied</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-teal-600 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
              <p className="text-xs font-bold text-navy">Financial Approval Granted</p>
              <p className="text-[11px] text-slate-500">Sanctioned by Meenakshi Iyer (JFC) · Deposit marked Active in ledger</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-amber-500 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                ●
              </span>
              <p className="text-xs font-bold text-navy">Maturity Monitoring Scheduled</p>
              <p className="text-[11px] text-slate-500">Maturity Date: {instrument.maturityDate} · Automated notifications active</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-navy">Audit History for {instrument.referenceNumber}</h2>
            <p className="text-xs text-slate-500">Cryptographically logged events matching entity ID {instrument.id}.</p>
          </div>

          <div className="space-y-3">
            {relatedAudits.length > 0 ? (
              relatedAudits.map(aud => (
                <div
                  key={aud.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy">{aud.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{aud.timestamp}</span>
                  </div>
                  <p className="text-slate-600">{aud.reason}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Actor: {aud.actor} ({aud.role})</span>
                    <span className="font-mono">IP: {aud.ipAddress}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Initial registration audit logged. Additional events will appear as lifecycle transitions occur.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: VERIFY INSTRUMENT CHECKLIST */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Execute 5-Point Verification Checklist"
        description={`Record formal verification findings for ${instrument.referenceNumber} (₹${instrument.amount.toLocaleString('en-IN')})`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            {[
              { key: 'physicalDocumentVerified', label: '1. Scanned / Physical Document Legitimacy & Stamp Verified' },
              { key: 'bankBranchMatches', label: `2. Bank Branch IFSC (${instrument.ifscCode}) Verified against RBI Master` },
              { key: 'validAmountAndPledge', label: '3. Full Amount Pledged to Institutional Accounts Officer' },
              { key: 'tenureMatchesTender', label: '4. Tenure Complies with Contract & 60-Day Buffer Period' },
              { key: 'noPriorLienNotice', label: '5. Clean Title: No Prior Lien or Judicial Encumbrance' },
            ].map(item => (
              <label key={item.key} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(checklist as any)[item.key]}
                  onChange={e => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 mt-0.5"
                />
                <span className="font-medium text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Verification Officer Remarks *
            </label>
            <textarea
              rows={3}
              value={verificationNotes}
              onChange={e => setVerificationNotes(e.target.value)}
              placeholder="Enter remarks, bank confirmation ref, or reason for return..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleVerifySubmit('returned_for_correction')}
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 font-bold hover:bg-amber-100"
            >
              Return for Correction
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerifySubmit('rejected')}
                className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 font-bold hover:bg-rose-100"
              >
                Reject Deposit
              </button>
              <button
                type="button"
                onClick={() => handleVerifySubmit('verified')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
              >
                Sign & Clear Verification
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: REQUEST RENEWAL */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title="Submit Renewal / Extension Request"
        description={`Extend deposit tenure for ${instrument.referenceNumber}. Original maturity: ${instrument.maturityDate}`}
        maxWidth="md"
      >
        <form onSubmit={handleRenewalSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Proposed New Maturity Date *
            </label>
            <input
              type="date"
              required
              value={proposedDate}
              onChange={e => setProposedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Extension Justification / Contract Clause *
            </label>
            <textarea
              required
              rows={3}
              value={renewalReason}
              onChange={e => setRenewalReason(e.target.value)}
              placeholder="e.g. Contract validity extended by Chief Engineer vide order CE/NHAI/2026/104"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
            >
              Submit Renewal Request
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: INITIATE RELEASE / REFUND */}
      <Modal
        isOpen={releaseModalOpen}
        onClose={() => setReleaseModalOpen(false)}
        title="Initiate Security Deposit Release & Refund"
        description={`Discharge pledge for ${instrument.referenceNumber} upon contract completion.`}
        maxWidth="lg"
      >
        <form onSubmit={handleReleaseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Contract Completion Status *
            </label>
            <select
              value={contractStatus}
              onChange={e => setContractStatus(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="fully_completed">Fully Completed · No Dues Certificate Issued</option>
              <option value="partially_completed">Partially Completed · Stage Release</option>
              <option value="deduction_applied">Deductions Applied · Liquidated Damages / Penalties</option>
            </select>
          </div>

          {contractStatus === 'deduction_applied' && (
            <div>
              <label className="block text-xs font-bold text-navy uppercase mb-1">
                Deduction Amount (INR)
              </label>
              <input
                type="number"
                value={deductionAmount}
                onChange={e => setDeductionAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Release Justification & Authority Order *
            </label>
            <textarea
              required
              rows={3}
              value={releaseReason}
              onChange={e => setReleaseReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Net Refund Payable</span>
            <p className="text-lg font-black text-emerald-700">
              ₹{Math.max(instrument.amount - Number(deductionAmount || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReleaseModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
            >
              Lodge Release Claim
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: UPLOAD SUPPORTING DOC */}
      <Modal
        isOpen={uploadDocModalOpen}
        onClose={() => setUploadDocModalOpen(false)}
        title="Upload Supporting Document"
        description={`Attach additional bank letter or endorsement to ${instrument.referenceNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bank_Lien_Confirmation_Letter"
              value={newDocName}
              onChange={e => setNewDocName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase mb-1">
              Document Category
            </label>
            <select
              value={newDocCategory}
              onChange={e => setNewDocCategory(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            >
              <option value="bank_letter">Bank Lien Confirmation Letter</option>
              <option value="renewal_endorsement">Renewal Endorsement Slip</option>
              <option value="release_claim">Release / Refund Signoff Claim</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setUploadDocModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
            >
              Upload & Attach
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
