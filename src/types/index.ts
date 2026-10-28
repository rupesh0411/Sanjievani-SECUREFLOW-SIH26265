export type UserRole = 
  | 'admin' 
  | 'institution' 
  | 'officer' 
  | 'approver' 
  | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  institutionId?: string;
  institutionName?: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin?: string;
}

export type InstrumentType = 
  | 'Fixed Deposit Receipt (FDR)'
  | 'Bank Guarantee (BG)'
  | 'Earnest Money Deposit (EMD)'
  | 'Security Deposit (Cash/Treasury)'
  | 'Performance Security';

export type InstrumentStatus = 
  | 'draft'
  | 'pending_verification'
  | 'under_review'
  | 'returned_for_correction'
  | 'pending_approval'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'renewal_requested'
  | 'renewed'
  | 'release_requested'
  | 'released'
  | 'rejected';

export interface DocumentItem {
  id: string;
  instrumentId: string;
  name: string;
  category: 'original_fdr' | 'bank_letter' | 'agreement_copy' | 'renewal_endorsement' | 'release_claim' | 'other';
  categoryLabel: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  verificationStatus: 'verified' | 'unverified' | 'flagged';
  notes?: string;
  url?: string;
}

export interface Instrument {
  id: string;                      // e.g., "SEC-2026-FDR-001"
  referenceNumber: string;         // Bank/deposit ref e.g. "SBI-FDR-88921478"
  type: InstrumentType;
  amount: number;
  currency: string;
  institutionId: string;
  institutionName: string;
  department: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber?: string;
  purpose: string;
  contractRef?: string;
  vendorName: string;
  issueDate: string;               // ISO date string: YYYY-MM-DD
  maturityDate: string;            // ISO date string: YYYY-MM-DD
  interestRate?: number;
  autoRenew: boolean;
  status: InstrumentStatus;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedApproverId?: string;
  assignedApproverName?: string;
  documents: DocumentItem[];
  daysToMaturity?: number;
  renewalCount: number;
  isDuplicateFlagged?: boolean;
  duplicateNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRecord {
  id: string;
  instrumentId: string;
  officerId: string;
  officerName: string;
  decision: 'verified' | 'returned_for_correction' | 'rejected' | 'awaiting_info';
  checklist: {
    physicalDocumentVerified: boolean;
    bankBranchMatches: boolean;
    validAmountAndPledge: boolean;
    tenureMatchesTender: boolean;
    noPriorLienNotice: boolean;
  };
  notes: string;
  timestamp: string;
}

export interface ApprovalRequest {
  id: string;
  instrumentId: string;
  instrumentRef: string;
  instrumentType: InstrumentType;
  institutionName: string;
  amount: number;
  requestedBy: string;
  requestType: 'initial_deposit' | 'renewal' | 'release_refund';
  stage: 'officer_review' | 'finance_approval' | 'director_approval' | 'completed' | 'rejected';
  assignedApproverId: string;
  assignedApproverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  comments?: string;
  submissionDate: string;
  actionDate?: string;
}

export interface RenewalRequest {
  id: string;
  instrumentId: string;
  instrumentRef: string;
  institutionName: string;
  originalMaturityDate: string;
  proposedMaturityDate: string;
  reason: string;
  replacementDocName?: string;
  requestedBy: string;
  requestDate: string;
  status: 'requested' | 'under_review' | 'awaiting_replacement' | 'completed' | 'rejected';
  approverNotes?: string;
}

export interface ReleaseRequest {
  id: string;
  instrumentId: string;
  instrumentRef: string;
  institutionName: string;
  vendorName: string;
  amount: number;
  reason: string;
  contractCompletionStatus: 'fully_completed' | 'partially_completed' | 'deduction_applied';
  deductionAmount?: number;
  netRefundAmount: number;
  requestedBy: string;
  requestDate: string;
  status: 'requested' | 'under_review' | 'approved' | 'released' | 'rejected';
  reviewNotes?: string;
  bankConfirmationRef?: string;
  disbursalDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'maturity_reminder' | 'verification' | 'approval' | 'renewal' | 'release' | 'system';
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  read: boolean;
  targetUrl: string;
  instrumentId?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  role: UserRole;
  action: 
    | 'USER_LOGIN'
    | 'INSTRUMENT_REGISTERED'
    | 'INSTRUMENT_UPDATED'
    | 'DOCUMENT_UPLOADED'
    | 'DOCUMENT_VERIFIED'
    | 'SUBMITTED_FOR_VERIFICATION'
    | 'VERIFICATION_APPROVED'
    | 'VERIFICATION_RETURNED'
    | 'APPROVAL_GRANTED'
    | 'APPROVAL_REJECTED'
    | 'RENEWAL_REQUESTED'
    | 'RENEWAL_EXECUTED'
    | 'RELEASE_REQUESTED'
    | 'RELEASE_AUTHORIZED'
    | 'SETTINGS_UPDATED'
    | 'ROLE_UPDATED';
  entity: 'Instrument' | 'Document' | 'Verification' | 'Approval' | 'Renewal' | 'Release' | 'User' | 'System';
  entityId: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  reason?: string;
  ipAddress: string;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  type: 'Central Public Sector' | 'Autonomous Body' | 'State Govt Department' | 'Higher Education Institute' | 'Health Institute';
  activeDepositsCount: number;
  totalPledgedAmount: number;
  contactOfficer: string;
  contactEmail: string;
}

export interface SystemSettings {
  reminderThresholds: number[];       // e.g. [60, 30, 15, 7] days
  autoEscalateDays: number;           // e.g. 5 days pending
  enforceDuplicateCheck: boolean;
  requirePhysicalVerificationCheck: boolean;
  allowSimulatedBankApi: boolean;
  institutionName: string;
  retentionPeriodYears: number;
}
