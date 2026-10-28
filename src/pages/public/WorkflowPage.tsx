import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  FileCheck2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  RefreshCcw, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Check,
  ChevronDown
} from 'lucide-react';

export const WorkflowPage: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'Deposit / FDR Registration',
      actor: 'Institution / Procurement Officer',
      objective: 'Capture accurate instrument parameters into a central digital registry.',
      details: [
        'Contractor/Vendor submits physical FDR, BG, or Treasury Receipt to the nodal tender office.',
        'Officer enters instrument reference number, issuing bank, branch IFSC, and pledge amount.',
        'Mandatory upload of high-resolution scanned certificate PDF (SHA-256 integrity hash calculated).',
        'System conducts immediate background check against existing active registry to flag duplicates.',
      ],
      ruleRef: 'DoE Goods Manual (2024) Para 6.1.2: Performance Security in acceptable forms including Fixed Deposit Receipts pledged to Accounts Officer.',
    },
    {
      step: '02',
      title: 'Automated Diagnostic Validation',
      actor: 'System Rules Engine',
      objective: 'Ensure strict compliance with tender conditions prior to human review.',
      details: [
        'Validates that deposit tenure extends at least 60 days beyond completion of all contractual obligations.',
        'Verifies bank IFSC code against official Reserve Bank of India NEFT/RTGS directory.',
        'Checks that deposit amount matches exact required percentage (3% to 5% or specified tender rate).',
        'Assigns unique tracking record ID (SEC-2026-FDR-XXX) and queues record for verification officer.',
      ],
      ruleRef: 'General Financial Rules (GFR 2017) Rule 170: Validity period requirements for Earnest Money and Performance Guarantees.',
    },
    {
      step: '03',
      title: 'Officer Review & 5-Point Verification Checklist',
      actor: 'Verification Officer (Treasury Cell)',
      objective: 'Independent verification of document authenticity and bank lien confirmation.',
      details: [
        'Officer inspects the physical instrument or bank lien confirmation advice.',
        'Executes 5-point verification checklist: Physical scan match, branch IFSC verification, amount & pledge check, tender duration alignment, and absence of prior lien notice.',
        'Can return dossier to institution user with specific correction notes or reject invalid instruments.',
        'Clears verified instruments for sanctioning authority review.',
      ],
      ruleRef: 'PPT Technical Approach Control Point: An uploaded file alone is not proof of bank authenticity; requires officer checks or authorized API.',
    },
    {
      step: '04',
      title: 'Financial Approver Sanction',
      actor: 'Joint Financial Controller / Competent Approver',
      objective: 'Formal authorization and activation of instrument under contract ledger.',
      details: [
        'Financial controller examines verified officer checklist and contract scope.',
        'Applies electronic sanction approval with timestamped reason.',
        'Strict role-segregation prevents users from approving their own registered entries.',
        'Status transitions to ACTIVE, and contractor compliance is marked in the central database.',
      ],
      ruleRef: 'DoE Procurement of Non-Consultancy Services (2025) Chapter 5: Delegation of Financial Powers for contract security acceptance.',
    },
    {
      step: '05',
      title: 'Continuous Validity & Maturity Monitoring',
      actor: 'Automated Calendar Daemon',
      objective: 'Zero expired instruments through proactive escalation alerts.',
      details: [
        'Calculates real-time days-to-maturity for all active deposits.',
        'Triggers automated alerts at 60 days, 30 days, 15 days, and 7 days prior to expiry.',
        'Sends dashboard notifications and escalation reminders to assigned project directors.',
        'Highlights expiring instruments in amber and matured un-extended deposits in red.',
      ],
      ruleRef: 'Audit Risk Mitigation: Preventing loss of financial claim due to statutory limitation periods on bank guarantees.',
    },
    {
      step: '06',
      title: 'Renewal Extension or Final Release Refund',
      actor: 'Finance Directorate & Bank Desk',
      objective: 'Orderly closure or extension with complete historical preservation.',
      details: [
        'Renewal: Contractor submits bank extension endorsement; system links renewed instrument to original without erasing history.',
        'Release: Upon issuance of Final Completion Certificate and Defect Liability Period clearance, full release is sanctioned.',
        'Deduction Handling: Supports liquidated damages deductions before issuing net refund authorization.',
        'Official discharge advice letter generated with bank confirmation code and archived in the immutable audit log.',
      ],
      ruleRef: 'DoE Manual 2024 Para 6.1.4: Prompt refund of Security Deposit within 60 days after completion of contractual obligations.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <FileCheck2 className="w-3.5 h-3.5" />
            STANDARD OPERATING PROCEDURE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#101C35] tracking-tight">
            Complete Instrument Lifecycle Governance
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A transparent 6-stage lifecycle aligned with Government of India Department of Expenditure guidelines, replacing manual friction with audited digital precision.
          </p>
        </div>
      </section>

      {/* Stages Timeline */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {stages.map((st, idx) => (
            <div
              key={st.step}
              className="relative pl-8 sm:pl-12 border-l-2 border-blue-200 space-y-4"
            >
              {/* Circular Step Badge */}
              <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center ring-4 ring-[#F5F7FB] shadow-md shadow-blue-500/30">
                {st.step}
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Stage {st.step}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy mt-0.5">
                      {st.title}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Role: {st.actor}
                  </span>
                </div>

                <p className="text-sm font-semibold text-teal-800">
                  Objective: {st.objective}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Execution Steps:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {st.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statutory Reference Callout */}
                <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Statutory Rule Reference:</strong> {st.ruleRef}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Interactive Workflow CTA */}
          <div className="rounded-3xl bg-[#101C35] text-white p-8 sm:p-10 text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold">Ready to Experience the Complete Workflow?</h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Test instrument registration, run duplicate scans, and review pending approval queues in our interactive demo environment.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-98"
              >
                <span>Launch Operational Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
