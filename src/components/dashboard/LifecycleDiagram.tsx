import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FilePlus, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle, 
  Clock, 
  RefreshCcw, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';

export const LifecycleDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'step-1',
      title: '1. Register',
      shortTitle: 'Register',
      role: 'Institution / Tenderer',
      icon: FilePlus,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Enter instrument attributes (Type, Amount, Bank IFSC, Maturity date, Contract reference) and upload scanned FDR / BG document.',
      controls: 'Instant duplicate reference check & field validation. Unique Record ID generated (e.g. SEC-2026-FDR-001).',
      output: 'Draft / Submitted Digital Instrument Record',
    },
    {
      id: 'step-2',
      title: '2. Validate',
      shortTitle: 'Validate',
      role: 'Automated System Engine',
      icon: ShieldCheck,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'System performs automated cross-checks against duplicate deposits, validates bank IFSC against RBI repository, and calculates maturity horizon.',
      controls: 'Hash checksum verification on supporting PDF attachments to prevent document tampering.',
      output: 'Validation Diagnostics Report & Duplicate Scan Flag',
    },
    {
      id: 'step-3',
      title: '3. Review',
      shortTitle: 'Review',
      role: 'Verification Officer',
      icon: UserCheck,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Designated verification officer inspects original physical instrument or bank lien confirmation letter, checking bank branch, lien pledge, and tenure.',
      controls: 'Mandatory 5-point verification checklist. Officer can return for correction or approve forward.',
      output: 'Signed Verification Checklist & Officer Review Dossier',
    },
    {
      id: 'step-4',
      title: '4. Approve',
      shortTitle: 'Approve',
      role: 'Financial Approver',
      icon: CheckCircle,
      color: 'bg-teal-600',
      lightColor: 'bg-teal-50 text-teal-700 border-teal-200',
      desc: 'Competent financial authority reviews verification findings and grants institutional approval to activate deposit under contract.',
      controls: 'Role segregation: Approvers cannot approve their own registered instruments. Timestamped audit log entry.',
      output: 'Formal Acceptance Order & Active Registry Status',
    },
    {
      id: 'step-5',
      title: '5. Monitor',
      shortTitle: 'Monitor',
      role: 'Automated Calendar & Treasury',
      icon: Clock,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'System tracks validity against contract timelines. Automated milestone alerts trigger at 60, 30, 15, and 7 days prior to expiry.',
      controls: 'Multi-channel dashboard notifications & automated escalation for un-extended maturing instruments.',
      output: 'Maturity Calendar Alerts & Institution Reminder Notices',
    },
    {
      id: 'step-6',
      title: '6. Renew or Release',
      shortTitle: 'Renew / Release',
      role: 'Approver & Finance Cell',
      icon: RefreshCcw,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Either extend instrument tenure with replacement endorsement (Renewal) or process final refund/discharge upon contract completion (Release).',
      controls: 'Historical instrument record preserved without overwriting original dates. Discharge letter tracked.',
      output: 'Renewed Instrument Record or Final Release Settlement',
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            End-to-End Governance
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#101C35]">
            The 6-Stage Financial Instrument Lifecycle
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            From initial submission to final refund, every stage is tracked with role segregation and immutable audit records.
          </p>
        </div>

        <Link
          to="/workflow"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
        >
          <span>Explore Complete Workflow Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Step Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50/70 shadow-md shadow-blue-500/10'
                  : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-white ${step.color} shadow-xs`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                {step.shortTitle}
              </span>
              <span className="text-[10px] text-slate-500 truncate w-full mt-0.5">
                {step.role}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Details Panel */}
      <div className="mt-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${current.lightColor}`}>
                Stage {activeStep + 1} of 6
              </span>
              <h4 className="text-lg font-bold text-[#101C35]">{current.title}</h4>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {current.desc}
            </p>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 text-xs space-y-1">
              <span className="font-bold text-navy flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Control Points & Verification Standards:
              </span>
              <p className="text-slate-600 pl-5">
                {current.controls}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Responsible Stakeholder</span>
              <p className="font-bold text-navy text-sm mt-0.5">{current.role}</p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Output Deliverable</span>
                <p className="font-semibold text-emerald-700 text-xs mt-0.5">{current.output}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="text-slate-500 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed font-medium"
              >
                &larr; Previous
              </button>

              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep(prev => prev + 1)}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center gap-1"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
