import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  UserCheck, 
  Calendar, 
  RefreshCw, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Database,
  FileCheck2,
  FolderLock
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 'registry',
      icon: FileSpreadsheet,
      badge: 'Core Feature 01',
      title: 'Centralized Instrument Registry',
      tagline: 'A unified single source of truth for all security deposits, FDRs, and guarantees.',
      desc: 'Replaces scattered local physical folders with a high-fidelity digital repository. Captures full bank branch IFSC details, tender numbers, contractor entities, interest rate schedules, and lien mandates.',
      capabilities: [
        'Multi-attribute search across reference numbers, banks, branches, and contractors',
        'Filtering by maturity windows, sanction stages, and issuing financial institutions',
        'Direct CSV and print-formatted register exports for treasury reconciliations',
        'Dedicated unique record identifier (SEC-2026-FDR-XXX) for every instrument',
      ],
      linkText: 'Explore Instrument Registry',
      linkUrl: '/dashboard/instruments',
    },
    {
      id: 'validation',
      icon: ShieldCheck,
      badge: 'Core Feature 02',
      title: 'Intelligent Validation & Duplicate Detection',
      tagline: 'Proactive safeguards against erroneous or duplicate financial instruments.',
      desc: 'Automatic background scanning checks reference numbers against existing active and archived deposits before registration is finalized, preventing accidental double-pledging.',
      capabilities: [
        'Instant duplicate warning system matching deposit reference across all institutions',
        'IFSC and bank branch format integrity checking with RBI clearing code validation',
        'Mandatory document upload validation with file checksum verification',
        'Tender validity vs deposit tenure reconciliation during the 4-step wizard',
      ],
      linkText: 'Test Registration Wizard',
      linkUrl: '/dashboard/instruments/new',
    },
    {
      id: 'verification',
      icon: UserCheck,
      badge: 'Core Feature 03',
      title: '5-Point Statutory Verification Queue',
      tagline: 'Standardized officer review checklists for bulletproof compliance.',
      desc: 'Standardizes verification across all procurement departments. Officers work through structured queues with document viewers, returning incomplete submissions with specific correction notes.',
      capabilities: [
        'Clear verification statuses: Verified, Returned for Correction, or Rejected',
        'Mandatory checklist covering branch match, pledge lien, and tender conditions',
        'Structured queues: Assigned to Me, Unassigned, Returned, and Completed',
        'Detailed officer notes recorded directly into the instrument timeline',
      ],
      linkText: 'Open Verification Queue',
      linkUrl: '/dashboard/verification',
    },
    {
      id: 'maturity',
      icon: Calendar,
      badge: 'Core Feature 04',
      title: 'Dynamic Maturity & Expiry Calendar',
      tagline: 'Zero missed dates with multi-frequency milestone alerts.',
      desc: 'Visual monthly and weekly calendar interface tracking every deposit maturity date. Automated reminder engine triggers alerts at 60, 30, 15, and 7 days prior to expiry.',
      capabilities: [
        'Color-coded event blocks: Active, Expiring Soon, Expired, and Renewed',
        'Interactive date navigation with direct click-through to instrument dossier',
        'Automated escalation notification to contracting officers when expiry nears',
        'Filter calendar events by institution and issuing bank',
      ],
      linkText: 'View Maturity Calendar',
      linkUrl: '/dashboard/maturity',
    },
    {
      id: 'lifecycle',
      icon: RefreshCw,
      badge: 'Core Feature 05',
      title: 'Renewals & Refund Release Engine',
      tagline: 'End-to-end lifecycle governance preserving complete historical lineage.',
      desc: 'When contracts are extended or completed, SECUREFLOW facilitates formal renewal endorsements or release vouchers without erasing original deposit records, ensuring a flawless audit trail.',
      capabilities: [
        '4-stage release workflow: Request → Review → Approval → Release Record',
        'Support for partial deductions or liquidated damages settlement',
        'Preservation of original maturity date and historical renewal cycles',
        'Bank discharge voucher tracking with disbursement transaction references',
      ],
      linkText: 'Manage Renewals & Releases',
      linkUrl: '/dashboard/renewals',
    },
    {
      id: 'audit',
      icon: BarChart3,
      badge: 'Core Feature 06',
      title: 'Statutory Reporting & Immutable Audit Trail',
      tagline: 'Full alignment with General Financial Rules & DoE Procurement Manuals.',
      desc: 'Every login, upload, checklist validation, and approval decision writes an immutable timestamped event. Generate institution-wise contingent liability summaries in seconds.',
      capabilities: [
        'Timestamped actor identity, IP address, and rationale logging for every action',
        'Institution-wise and bank-wise contingent liability charts & tables',
        '1-click export to CSV and print-ready formal procurement reports',
        'Tamper-evident system activity monitoring aligned with CAG requirements',
      ],
      linkText: 'Inspect Audit Logs',
      linkUrl: '/dashboard/audit',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            ENTERPRISE ARCHITECTURE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#101C35] tracking-tight">
            Engineered for Precision, Trust & Speed
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the six architectural pillars that make SECUREFLOW the premier digital portal for security deposit and FDR lifecycle governance.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={feat.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-8 lg:p-10 transition-all hover:shadow-card-hover"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Left Column Description */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        {feat.badge}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C35] tracking-tight">
                      {feat.title}
                    </h2>

                    <p className="text-sm font-semibold text-teal-700">
                      {feat.tagline}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={feat.linkUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-98"
                      >
                        <span>{feat.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column Capability Checklist */}
                  <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200 p-6 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operational Capabilities
                    </h3>

                    <ul className="space-y-3">
                      {feat.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};
