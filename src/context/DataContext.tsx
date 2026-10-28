import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Instrument, 
  Institution, 
  ApprovalRequest, 
  RenewalRequest, 
  ReleaseRequest, 
  NotificationItem, 
  AuditEvent, 
  SystemSettings,
  DocumentItem
} from '../types';
import { 
  INITIAL_INSTRUMENTS, 
  DEMO_INSTITUTIONS, 
  INITIAL_APPROVAL_REQUESTS, 
  INITIAL_RENEWAL_REQUESTS, 
  INITIAL_RELEASE_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_EVENTS, 
  INITIAL_SETTINGS 
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  instruments: Instrument[];
  institutions: Institution[];
  approvalRequests: ApprovalRequest[];
  renewalRequests: RenewalRequest[];
  releaseRequests: ReleaseRequest[];
  notifications: NotificationItem[];
  auditEvents: AuditEvent[];
  settings: SystemSettings;
  
  // Actions
  addInstrument: (instrumentData: Omit<Instrument, 'id' | 'createdAt' | 'updatedAt' | 'renewalCount'>) => Instrument;
  updateInstrument: (id: string, partial: Partial<Instrument>) => void;
  verifyInstrument: (
    instrumentId: string, 
    decision: 'verified' | 'returned_for_correction' | 'rejected' | 'awaiting_info',
    checklist: {
      physicalDocumentVerified: boolean;
      bankBranchMatches: boolean;
      validAmountAndPledge: boolean;
      tenureMatchesTender: boolean;
      noPriorLienNotice: boolean;
    },
    notes: string
  ) => void;
  approveRequest: (approvalId: string, decision: 'approved' | 'rejected' | 'returned', comments?: string) => void;
  requestRenewal: (instrumentId: string, proposedMaturityDate: string, reason: string, replacementDocName?: string) => void;
  requestRelease: (instrumentId: string, reason: string, contractStatus: 'fully_completed' | 'partially_completed' | 'deduction_applied', netRefundAmount: number) => void;
  executeRelease: (releaseId: string, bankConfirmationRef: string) => void;
  uploadDocument: (instrumentId: string, doc: Omit<DocumentItem, 'id' | 'instrumentId' | 'uploadedAt' | 'version'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  resetDemoData: () => void;
  checkDuplicate: (refNumber: string, bankName?: string, currentInstrumentId?: string) => { isDuplicate: boolean; matchedInstrument?: Instrument };
  getInstrumentById: (id: string) => Instrument | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INSTRUMENTS: 'secureflow_instruments_v1',
  APPROVALS: 'secureflow_approvals_v1',
  RENEWALS: 'secureflow_renewals_v1',
  RELEASES: 'secureflow_releases_v1',
  NOTIFICATIONS: 'secureflow_notifications_v1',
  AUDIT: 'secureflow_audit_v1',
  SETTINGS: 'secureflow_settings_v1',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [instruments, setInstruments] = useState<Instrument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INSTRUMENTS);
      return stored ? JSON.parse(stored) : INITIAL_INSTRUMENTS;
    } catch {
      return INITIAL_INSTRUMENTS;
    }
  });

  const [institutions] = useState<Institution[]>(DEMO_INSTITUTIONS);

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      return stored ? JSON.parse(stored) : INITIAL_APPROVAL_REQUESTS;
    } catch {
      return INITIAL_APPROVAL_REQUESTS;
    }
  });

  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RENEWALS);
      return stored ? JSON.parse(stored) : INITIAL_RENEWAL_REQUESTS;
    } catch {
      return INITIAL_RENEWAL_REQUESTS;
    }
  });

  const [releaseRequests, setReleaseRequests] = useState<ReleaseRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RELEASES);
      return stored ? JSON.parse(stored) : INITIAL_RELEASE_REQUESTS;
    } catch {
      return INITIAL_RELEASE_REQUESTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_EVENTS;
    } catch {
      return INITIAL_AUDIT_EVENTS;
    }
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(instruments));
  }, [instruments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvalRequests));
  }, [approvalRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RENEWALS, JSON.stringify(renewalRequests));
  }, [renewalRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releaseRequests));
  }, [releaseRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditEvents));
  }, [auditEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Log an audit event
  const logAudit = (
    action: AuditEvent['action'],
    entity: AuditEvent['entity'],
    entityId: string,
    result: AuditEvent['result'],
    reason?: string
  ) => {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser?.name || 'Authorized Officer',
      actorEmail: currentUser?.email || 'officer@secureflow.demo',
      role: currentUser?.role || 'officer',
      action,
      entity,
      entityId,
      result,
      reason,
      ipAddress: '10.14.88.' + (Math.floor(Math.random() * 80) + 10),
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const checkDuplicate = (refNumber: string, _bankName?: string, currentInstrumentId?: string) => {
    const cleaned = refNumber.trim().toLowerCase();
    if (!cleaned) return { isDuplicate: false };
    const match = instruments.find(
      inst => inst.id !== currentInstrumentId && inst.referenceNumber.trim().toLowerCase() === cleaned
    );
    return {
      isDuplicate: !!match,
      matchedInstrument: match,
    };
  };

  const getInstrumentById = (id: string): Instrument | undefined => {
    return instruments.find(inst => inst.id === id);
  };

  const addInstrument = (
    data: Omit<Instrument, 'id' | 'createdAt' | 'updatedAt' | 'renewalCount'>
  ): Instrument => {
    const typeCode = data.type.includes('FDR') ? 'FDR' : data.type.includes('BG') ? 'BG' : 'DEP';
    const nextNum = (instruments.length + 1).toString().padStart(3, '0');
    const newId = `SEC-2026-${typeCode}-${nextNum}`;
    const nowStr = new Date().toISOString().split('T')[0];

    const newInstrument: Instrument = {
      ...data,
      id: newId,
      renewalCount: 0,
      createdAt: nowStr,
      updatedAt: nowStr,
      status: data.status || 'pending_verification',
      assignedOfficerId: 'usr-officer',
      assignedOfficerName: 'Vikramaditya Verma',
      assignedApproverId: 'usr-approver',
      assignedApproverName: 'Meenakshi Iyer',
    };

    setInstruments(prev => [newInstrument, ...prev]);

    // Create a notification for the verification queue
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Instrument Registered',
      message: `${newInstrument.type} (${newInstrument.referenceNumber}) for ₹${newInstrument.amount.toLocaleString('en-IN')} registered and submitted for verification.`,
      type: 'verification',
      severity: 'info',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      targetUrl: `/dashboard/instruments/${newId}`,
      instrumentId: newId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    logAudit('INSTRUMENT_REGISTERED', 'Instrument', newId, 'SUCCESS', `Registered with reference ${data.referenceNumber}`);
    return newInstrument;
  };

  const updateInstrument = (id: string, partial: Partial<Instrument>) => {
    setInstruments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = {
            ...item,
            ...partial,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          return updated;
        }
        return item;
      })
    );
    logAudit('INSTRUMENT_UPDATED', 'Instrument', id, 'SUCCESS', 'Instrument details modified');
  };

  const verifyInstrument = (
    instrumentId: string,
    decision: 'verified' | 'returned_for_correction' | 'rejected' | 'awaiting_info',
    checklist: {
      physicalDocumentVerified: boolean;
      bankBranchMatches: boolean;
      validAmountAndPledge: boolean;
      tenureMatchesTender: boolean;
      noPriorLienNotice: boolean;
    },
    notes: string
  ) => {
    const inst = instruments.find(i => i.id === instrumentId);
    if (!inst) return;

    let nextStatus: Instrument['status'] = inst.status;
    let apprStatus: ApprovalRequest['status'] = 'pending';

    if (decision === 'verified') {
      nextStatus = 'pending_approval';
      // Route to approval queue
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        instrumentId,
        instrumentRef: inst.referenceNumber,
        instrumentType: inst.type,
        institutionName: inst.institutionName,
        amount: inst.amount,
        requestedBy: inst.documents[0]?.uploadedBy || 'Institutional User',
        requestType: 'initial_deposit',
        stage: 'finance_approval',
        assignedApproverId: 'usr-approver',
        assignedApproverName: 'Meenakshi Iyer',
        status: 'pending',
        comments: `Verification passed. Officer Notes: ${notes}`,
        submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setApprovalRequests(prev => [newApproval, ...prev]);

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Instrument Verification Cleared',
        message: `${inst.referenceNumber} has passed verification checks and routed for Finance Approval.`,
        type: 'approval',
        severity: 'success',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        targetUrl: `/dashboard/approvals`,
        instrumentId,
      };
      setNotifications(prev => [notif, ...prev]);

      logAudit('VERIFICATION_APPROVED', 'Verification', instrumentId, 'SUCCESS', notes || 'All verification checklist items satisfied');
    } else if (decision === 'returned_for_correction') {
      nextStatus = 'returned_for_correction';
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Document Returned for Correction',
        message: `${inst.referenceNumber} was returned by the verification officer. Reason: ${notes}`,
        type: 'verification',
        severity: 'warning',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        targetUrl: `/dashboard/instruments/${instrumentId}`,
        instrumentId,
      };
      setNotifications(prev => [notif, ...prev]);
      logAudit('VERIFICATION_RETURNED', 'Verification', instrumentId, 'WARNING', notes);
    } else if (decision === 'rejected') {
      nextStatus = 'rejected';
      logAudit('APPROVAL_REJECTED', 'Verification', instrumentId, 'FAILED', notes);
    }

    updateInstrument(instrumentId, { status: nextStatus });
  };

  const approveRequest = (
    approvalId: string, 
    decision: 'approved' | 'rejected' | 'returned', 
    comments?: string
  ) => {
    const appr = approvalRequests.find(a => a.id === approvalId);
    if (!appr) return;

    const actionTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setApprovalRequests(prev =>
      prev.map(a =>
        a.id === approvalId
          ? { ...a, status: decision, comments: comments || a.comments, actionDate: actionTime, stage: decision === 'approved' ? 'completed' : 'rejected' }
          : a
      )
    );

    // Apply corresponding lifecycle update on Instrument
    const targetInst = instruments.find(i => i.id === appr.instrumentId);
    if (targetInst) {
      if (decision === 'approved') {
        if (appr.requestType === 'initial_deposit') {
          updateInstrument(appr.instrumentId, { status: 'active' });
        } else if (appr.requestType === 'renewal') {
          updateInstrument(appr.instrumentId, { 
            status: 'renewed',
            renewalCount: (targetInst.renewalCount || 0) + 1 
          });
          // Update renewal request status
          setRenewalRequests(prev =>
            prev.map(r => r.instrumentId === appr.instrumentId ? { ...r, status: 'completed' } : r)
          );
        } else if (appr.requestType === 'release_refund') {
          updateInstrument(appr.instrumentId, { status: 'released' });
          setReleaseRequests(prev =>
            prev.map(r => r.instrumentId === appr.instrumentId ? { ...r, status: 'released' } : r)
          );
        }
        logAudit('APPROVAL_GRANTED', 'Approval', approvalId, 'SUCCESS', comments || `Sanction granted for ${appr.requestType}`);
      } else {
        updateInstrument(appr.instrumentId, { status: decision === 'rejected' ? 'rejected' : 'returned_for_correction' });
        logAudit('APPROVAL_REJECTED', 'Approval', approvalId, 'FAILED', comments || 'Approval request was rejected');
      }
    }
  };

  const requestRenewal = (
    instrumentId: string,
    proposedMaturityDate: string,
    reason: string,
    replacementDocName?: string
  ) => {
    const inst = instruments.find(i => i.id === instrumentId);
    if (!inst) return;

    const newRenewal: RenewalRequest = {
      id: `ren-${Date.now()}`,
      instrumentId,
      instrumentRef: inst.referenceNumber,
      institutionName: inst.institutionName,
      originalMaturityDate: inst.maturityDate,
      proposedMaturityDate,
      reason,
      replacementDocName: replacementDocName || 'Endorsement_Application.pdf',
      requestedBy: currentUser?.name || 'Institution Officer',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'under_review',
      approverNotes: 'Renewal submitted. Forwarded to finance approver.',
    };

    setRenewalRequests(prev => [newRenewal, ...prev]);

    // Create approval queue item
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      instrumentId,
      instrumentRef: inst.referenceNumber,
      instrumentType: inst.type,
      institutionName: inst.institutionName,
      amount: inst.amount,
      requestedBy: currentUser?.name || 'Priyanka Sen',
      requestType: 'renewal',
      stage: 'finance_approval',
      assignedApproverId: 'usr-approver',
      assignedApproverName: 'Meenakshi Iyer',
      status: 'pending',
      comments: `Proposed extension to ${proposedMaturityDate}. Reason: ${reason}`,
      submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setApprovalRequests(prev => [newApproval, ...prev]);

    updateInstrument(instrumentId, { status: 'renewal_requested' });
    logAudit('RENEWAL_REQUESTED', 'Renewal', newRenewal.id, 'SUCCESS', reason);
  };

  const requestRelease = (
    instrumentId: string,
    reason: string,
    contractStatus: 'fully_completed' | 'partially_completed' | 'deduction_applied',
    netRefundAmount: number
  ) => {
    const inst = instruments.find(i => i.id === instrumentId);
    if (!inst) return;

    const newRelease: ReleaseRequest = {
      id: `rel-${Date.now()}`,
      instrumentId,
      instrumentRef: inst.referenceNumber,
      institutionName: inst.institutionName,
      vendorName: inst.vendorName,
      amount: inst.amount,
      reason,
      contractCompletionStatus: contractStatus,
      netRefundAmount,
      requestedBy: currentUser?.name || 'Institution Officer',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'under_review',
      reviewNotes: 'Release dossier prepared with no dues certificate.',
    };

    setReleaseRequests(prev => [newRelease, ...prev]);

    // Create approval request
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      instrumentId,
      instrumentRef: inst.referenceNumber,
      instrumentType: inst.type,
      institutionName: inst.institutionName,
      amount: netRefundAmount,
      requestedBy: currentUser?.name || 'Priyanka Sen',
      requestType: 'release_refund',
      stage: 'director_approval',
      assignedApproverId: 'usr-approver',
      assignedApproverName: 'Meenakshi Iyer',
      status: 'pending',
      comments: `Release and refund request for ₹${netRefundAmount.toLocaleString('en-IN')}. Reason: ${reason}`,
      submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setApprovalRequests(prev => [newApproval, ...prev]);

    updateInstrument(instrumentId, { status: 'release_requested' });
    logAudit('RELEASE_REQUESTED', 'Release', newRelease.id, 'SUCCESS', reason);
  };

  const executeRelease = (releaseId: string, bankConfirmationRef: string) => {
    const rel = releaseRequests.find(r => r.id === releaseId);
    if (!rel) return;

    const nowStr = new Date().toISOString().split('T')[0];

    setReleaseRequests(prev =>
      prev.map(r =>
        r.id === releaseId
          ? {
              ...r,
              status: 'released',
              bankConfirmationRef,
              disbursalDate: nowStr,
              reviewNotes: `Disbursed and released via bank ref ${bankConfirmationRef}`,
            }
          : r
      )
    );

    updateInstrument(rel.instrumentId, { status: 'released' });
    logAudit('RELEASE_AUTHORIZED', 'Release', releaseId, 'SUCCESS', `Bank lien discharge advice: ${bankConfirmationRef}`);
  };

  const uploadDocument = (
    instrumentId: string,
    docData: Omit<DocumentItem, 'id' | 'instrumentId' | 'uploadedAt' | 'version'>
  ) => {
    const targetInst = instruments.find(i => i.id === instrumentId);
    if (!targetInst) return;

    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      instrumentId,
      version: (targetInst.documents.length || 0) + 1,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verificationStatus: 'unverified',
    };

    const updatedDocs = [...targetInst.documents, newDoc];
    updateInstrument(instrumentId, { documents: updatedDocs });
    logAudit('DOCUMENT_UPLOADED', 'Document', newDoc.id, 'SUCCESS', `Uploaded ${docData.name}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (partial: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
    logAudit('SETTINGS_UPDATED', 'System', 'system_config', 'SUCCESS', 'System configuration updated');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.INSTRUMENTS);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.RENEWALS);
    localStorage.removeItem(STORAGE_KEYS.RELEASES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    setInstruments(INITIAL_INSTRUMENTS);
    setApprovalRequests(INITIAL_APPROVAL_REQUESTS);
    setRenewalRequests(INITIAL_RENEWAL_REQUESTS);
    setReleaseRequests(INITIAL_RELEASE_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setSettings(INITIAL_SETTINGS);

    logAudit('SETTINGS_UPDATED', 'System', 'demo_reset', 'SUCCESS', 'Demo dataset restored to initial state');
  };

  return (
    <DataContext.Provider
      value={{
        instruments,
        institutions,
        approvalRequests,
        renewalRequests,
        releaseRequests,
        notifications,
        auditEvents,
        settings,
        addInstrument,
        updateInstrument,
        verifyInstrument,
        approveRequest,
        requestRenewal,
        requestRelease,
        executeRelease,
        uploadDocument,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetDemoData,
        checkDuplicate,
        getInstrumentById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
