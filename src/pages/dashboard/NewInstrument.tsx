import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstrumentType } from '../../types';

export const NewInstrument: React.FC = () => {
  const { addInstrument, checkDuplicate, institutions } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Instrument Info
    type: 'Fixed Deposit Receipt (FDR)' as InstrumentType,
    referenceNumber: '',
    amount: '',
    currency: 'INR',
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: '',
    interestRate: '7.25',
    autoRenew: false,

    // Step 2: Institution & Bank
    institutionId: institutions[0]?.id || 'inst-01',
    institutionName: institutions[0]?.name || 'National Highways Authority of India (NHAI)',
    department: 'Expressway Construction Division',
    bankName: 'State Bank of India',
    branchName: 'Corporate Accounts Group, New Delhi',
    ifscCode: 'SBIN0000691',
    accountNumber: '',
    contractRef: '',
    vendorName: '',
    purpose: '',

    // Step 3: Documents
    documents: [
      {
        id: 'doc-temp-1',
        name: 'Original_Deposit_Receipt_Scan.pdf',
        category: 'original_fdr' as const,
        categoryLabel: 'Original FDR Certificate',
        fileSize: '2.4 MB',
        fileType: 'application/pdf',
        uploadedBy: currentUser?.name || 'Institution Officer',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        version: 1,
        verificationStatus: 'unverified' as const,
      }
    ],
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Check duplicate when reference number changes
  const handleRefChange = (refNum: string) => {
    setFormData(prev => ({ ...prev, referenceNumber: refNum }));
    if (refNum.trim().length > 3) {
      const dup = checkDuplicate(refNum);
      if (dup.isDuplicate) {
        setDuplicateWarning(`Warning: Reference number "${refNum}" already exists in the registry for ${dup.matchedInstrument?.institutionName} (Status: ${dup.matchedInstrument?.status}).`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleInstitutionChange = (instId: string) => {
    const inst = institutions.find(i => i.id === instId);
    if (inst) {
      setFormData(prev => ({
        ...prev,
        institutionId: inst.id,
        institutionName: inst.name,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        category: 'original_fdr' as const,
        categoryLabel: 'Original Document Scan',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type || 'application/pdf',
        uploadedBy: currentUser?.name || 'Institution Officer',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        version: 1,
        verificationStatus: 'unverified' as const,
      };
      setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
    }
  };

  const handleRemoveDoc = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id),
    }));
  };

  const validateStep1 = () => {
    if (!formData.referenceNumber.trim()) return 'Reference number is required';
    if (!formData.amount || Number(formData.amount) <= 0) return 'Valid amount is required';
    if (!formData.issueDate) return 'Issue date is required';
    if (!formData.maturityDate) return 'Maturity date is required';
    if (new Date(formData.maturityDate) <= new Date(formData.issueDate)) {
      return 'Maturity date must be after Issue date';
    }
    return null;
  };

  const validateStep2 = () => {
    if (!formData.bankName.trim()) return 'Issuing bank name is required';
    if (!formData.ifscCode.trim()) return 'Branch IFSC code is required';
    if (!formData.vendorName.trim()) return 'Contractor / Vendor entity name is required';
    if (!formData.purpose.trim()) return 'Purpose / Tender description is required';
    return null;
  };

  const [stepError, setStepError] = useState<string | null>(null);

  const handleNext = () => {
    setStepError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setStepError(err);
        return;
      }
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setStepError(err);
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = (asDraft: boolean = false) => {
    const newRecord = addInstrument({
      referenceNumber: formData.referenceNumber,
      type: formData.type,
      amount: Number(formData.amount),
      currency: formData.currency,
      institutionId: formData.institutionId,
      institutionName: formData.institutionName,
      department: formData.department,
      bankName: formData.bankName,
      branchName: formData.branchName,
      ifscCode: formData.ifscCode,
      accountNumber: formData.accountNumber,
      contractRef: formData.contractRef,
      vendorName: formData.vendorName,
      purpose: formData.purpose,
      issueDate: formData.issueDate,
      maturityDate: formData.maturityDate,
      interestRate: Number(formData.interestRate),
      autoRenew: formData.autoRenew,
      status: asDraft ? 'draft' : 'pending_verification',
      documents: formData.documents.map(d => ({ ...d, instrumentId: '' })),
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    navigate(`/dashboard/instruments/${newRecord.id}`);
  };

  const stepsHeader = [
    { num: 1, label: 'Instrument Details' },
    { num: 2, label: 'Institution & Bank' },
    { num: 3, label: 'Supporting Documents' },
    { num: 4, label: 'Review & Submit' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy tracking-tight">
          Register Financial Instrument
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          4-step registration wizard with automated duplicate reference verification.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stepsHeader.map(s => {
            const isDone = s.num < step;
            const isCurr = s.num === step;
            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  isCurr
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-100 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurr
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="text-xs truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
        {stepError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* STEP 1: Instrument Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2">
              Step 1 — Instrument Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Instrument Type *
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option>Fixed Deposit Receipt (FDR)</option>
                  <option>Bank Guarantee (BG)</option>
                  <option>Earnest Money Deposit (EMD)</option>
                  <option>Security Deposit (Cash/Treasury)</option>
                  <option>Performance Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Bank Reference / Certificate Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI-FDR-9821456"
                  value={formData.referenceNumber}
                  onChange={e => handleRefChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-semibold"
                />
                {duplicateWarning && (
                  <p className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{duplicateWarning}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Deposit Amount (INR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 25000000"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                />
                {formData.amount && Number(formData.amount) > 0 && (
                  <p className="mt-1 text-[11px] text-blue-600 font-semibold">
                    ₹{Number(formData.amount).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Maturity / Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.maturityDate}
                  onChange={e => setFormData({ ...formData, maturityDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-rose-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.interestRate}
                  onChange={e => setFormData({ ...formData, interestRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={e => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mandate Auto-Renewal upon maturity (Contract Clause)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Institution & Bank */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2">
              Step 2 — Institution & Bank Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Procuring Institution *
                </label>
                <select
                  value={formData.institutionId}
                  onChange={e => handleInstitutionChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.code} — {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Division / Cell *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Issuing Bank Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Bank of India"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Branch Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CAG Branch, Parliament Street"
                  value={formData.branchName}
                  onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Branch IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBIN0000691"
                  value={formData.ifscCode}
                  onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Contractor / Vendor Entity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Larsen & Toubro Infrastructure Ltd"
                  value={formData.vendorName}
                  onChange={e => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Tender / Contract Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. NHAI/DL-DDN/PKG4/2026/782"
                  value={formData.contractRef}
                  onChange={e => setFormData({ ...formData, contractRef: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Purpose / Tender Description *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Performance Guarantee for Greenfield Expressway Package 4 civil construction"
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Supporting Documents */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2">
              Step 3 — Document Attachment & Verification Checklist
            </h2>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-navy">
                Click or drag & drop scanned FDR / Bank Guarantee (PDF or Image)
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PDF, PNG, JPG up to 10MB · Automatic SHA-256 Checksum Calculation
              </p>
            </div>

            {/* Attached Documents List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Attached Files ({formData.documents.length}):
              </span>

              {formData.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-navy">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {doc.fileSize} · Uploaded by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2">
              Step 4 — Final Review & Verification Submission
            </h2>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reference Number</span>
                  <p className="font-bold text-navy text-sm font-mono mt-0.5">{formData.referenceNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Deposit Amount</span>
                  <p className="font-bold text-blue-600 text-sm mt-0.5">
                    ₹{Number(formData.amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Type</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{formData.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Procuring Institution</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{formData.institutionName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Issuing Bank & IFSC</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{formData.bankName} ({formData.ifscCode})</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contractor / Vendor</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{formData.vendorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Issue Date</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{formData.issueDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Maturity Date</span>
                  <p className="font-bold text-rose-700 mt-0.5">{formData.maturityDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Attached Documents</span>
                  <p className="font-semibold text-emerald-700 mt-0.5">{formData.documents.length} Files Attached</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Workflow Next Stage:
              </span>
              <p className="text-blue-800 leading-relaxed">
                Upon submission, this instrument will be routed directly to the <strong>Verification Officer Queue (Treasury Cell)</strong> for 5-point physical verification.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStepError(null);
                setStep(prev => prev - 1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step === 4 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all active:scale-98"
                >
                  <span>Submit for Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-98"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
