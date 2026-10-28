import React from 'react';
import { InstrumentStatus } from '../../types';

interface StatusBadgeProps {
  status: InstrumentStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showDot = true 
}) => {
  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'active':
        return {
          label: 'Active Deposit',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'expiring_soon':
        return {
          label: 'Expiring Soon',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'expired':
        return {
          label: 'Matured / Expired',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'pending_verification':
        return {
          label: 'Pending Verification',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'returned_for_correction':
        return {
          label: 'Returned for Correction',
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
        };
      case 'pending_approval':
        return {
          label: 'Pending Approval',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'renewal_requested':
        return {
          label: 'Renewal Requested',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
        };
      case 'renewed':
        return {
          label: 'Renewed & Active',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-600',
        };
      case 'release_requested':
        return {
          label: 'Release Requested',
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          dot: 'bg-cyan-500',
        };
      case 'released':
        return {
          label: 'Released / Refunded',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-500',
        };
      case 'draft':
        return {
          label: 'Draft',
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
        };
      case 'pending':
        return {
          label: 'Pending',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'approved':
        return {
          label: 'Approved',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'verified':
        return {
          label: 'Verified',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          label: s.replace(/_/g, ' '),
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs capitalize ${config.bg} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      )}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
};
