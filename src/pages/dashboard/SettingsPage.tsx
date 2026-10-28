import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  User, 
  Bell, 
  Building2, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Save,
  Lock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useData();
  const { currentUser } = useAuth();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formSettings, setFormSettings] = useState({
    enforceDuplicateCheck: settings.enforceDuplicateCheck,
    requirePhysicalVerificationCheck: settings.requirePhysicalVerificationCheck,
    allowSimulatedBankApi: settings.allowSimulatedBankApi,
    retentionPeriodYears: settings.retentionPeriodYears,
    autoEscalateDays: settings.autoEscalateDays,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset SECUREFLOW demo data to initial 25 records and mock audit logs?')) {
      resetDemoData();
      alert('Demo data successfully restored to fresh hackathon state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy tracking-tight">
          System Settings & Operational Policies
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure notification thresholds, duplicate detection rules, and institutional retention policies.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>System configuration updated and logged to audit trail.</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <h2 className="text-base font-bold text-navy flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-blue-600" />
          <span>Authenticated Officer Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
            <p className="font-bold text-navy text-sm mt-0.5">{currentUser?.name}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Email</span>
            <p className="font-mono text-slate-700 text-sm mt-0.5">{currentUser?.email}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Role & Title</span>
            <p className="font-semibold text-blue-600 mt-0.5 capitalize">{currentUser?.roleTitle}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Department / Cell</span>
            <p className="font-semibold text-slate-700 mt-0.5">{currentUser?.department}</p>
          </div>
        </div>
      </div>

      {/* Workflow Policy Configuration Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
        <h2 className="text-base font-bold text-navy flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Automated Verification & Policy Thresholds</span>
        </h2>

        <div className="space-y-4 text-xs">
          <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formSettings.enforceDuplicateCheck}
              onChange={e => setFormSettings({ ...formSettings, enforceDuplicateCheck: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 mt-0.5"
            />
            <div>
              <span className="font-bold text-navy block">Enforce Background Duplicate Reference Scan</span>
              <span className="text-slate-500 text-[11px]">
                Prevents registration of deposits with reference numbers already pledged in active contracts across all departments.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formSettings.requirePhysicalVerificationCheck}
              onChange={e => setFormSettings({ ...formSettings, requirePhysicalVerificationCheck: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 mt-0.5"
            />
            <div>
              <span className="font-bold text-navy block">Mandatory 5-Point Officer Verification Checklist</span>
              <span className="text-slate-500 text-[11px]">
                Requires designated treasury officer signature before any registered instrument can proceed to the Financial Approver desk.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formSettings.allowSimulatedBankApi}
              onChange={e => setFormSettings({ ...formSettings, allowSimulatedBankApi: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 mt-0.5"
            />
            <div>
              <span className="font-bold text-navy block">Enable Simulated Bank SFMS / Core Banking Advice API</span>
              <span className="text-slate-500 text-[11px]">
                Simulates real-time bank branch confirmation codes for demo evaluation without live RBI network integration.
              </span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Statutory Record Retention Period (Years)
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={formSettings.retentionPeriodYears}
              onChange={e => setFormSettings({ ...formSettings, retentionPeriodYears: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              GFR Rule 301 recommends minimum 8-year statutory archive for released guarantees.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              Escalation Window for Maturing Instruments (Days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formSettings.autoEscalateDays}
              onChange={e => setFormSettings({ ...formSettings, autoEscalateDays: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Days before maturity when daily urgent reminder alerts begin escalating to division head.
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-200 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Restore Fresh Demo State (Hackathon Testing)</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Reset all 25 financial instruments, approval workflows, and audit histories back to the initial pre-configured evaluation state. This clears any local browser modifications.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
        >
          Reset Demo Dataset
        </button>
      </div>
    </div>
  );
};
