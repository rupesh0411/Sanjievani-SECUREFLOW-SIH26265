import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Search, 
  UserCheck, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../../types';

export const UserManagementPage: React.FC = () => {
  const { availableUsers, currentUser, switchRole } = useAuth();
  const [usersList, setUsersList] = useState<User[]>(availableUsers);
  const [search, setSearch] = useState('');

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const permissionsMatrix = [
    { module: 'Register Deposit / Upload Documents', admin: true, institution: true, officer: false, approver: false, auditor: false },
    { module: 'Execute 5-Point Verification Checklist', admin: true, institution: false, officer: true, approver: false, auditor: false },
    { module: 'Return Submission for Correction', admin: true, institution: false, officer: true, approver: false, auditor: false },
    { module: 'Grant Financial Sanction / Approval', admin: true, institution: false, officer: false, approver: true, auditor: false },
    { module: 'Request Renewal or Refund Release', admin: true, institution: true, officer: false, approver: false, auditor: false },
    { module: 'Confirm Final Bank Disbursal Voucher', admin: true, institution: false, officer: true, approver: true, auditor: false },
    { module: 'Full Read-Only Audit & Reporting', admin: true, institution: false, officer: true, approver: true, auditor: true },
    { module: 'Manage System Settings & Escalations', admin: true, institution: false, officer: false, approver: false, auditor: false },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            User Management & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage institutional personas, role allocations, and permission hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
            {usersList.length} Authorized Stakeholders
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Officer Name</th>
                <th className="py-3 px-4 font-bold">Role Title</th>
                <th className="py-3 px-4 font-bold">Department / Institution</th>
                <th className="py-3 px-4 font-bold">Official Email</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Switch & Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map(u => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{u.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        {u.roleTitle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{u.institutionName}</p>
                      <p className="text-[10px] text-slate-400">{u.department}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize transition-colors ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isCurrent ? (
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]">
                          Active Persona
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => switchRole(u.role)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors"
                        >
                          <span>Switch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-navy">
            Institutional Role & Permission Matrix (Segregation of Duties)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict role boundaries guarantee accountability and prevent unauthorized financial transactions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Operational Capability</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Institution</th>
                <th className="py-3 px-3 text-center">Officer</th>
                <th className="py-3 px-3 text-center">Approver</th>
                <th className="py-3 px-3 text-center">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-navy">{row.module}</td>
                  <td className="py-3 px-3 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.institution ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.officer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.approver ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.auditor ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
