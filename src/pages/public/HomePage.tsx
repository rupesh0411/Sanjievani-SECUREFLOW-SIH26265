import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { InteractivePreview } from '../../components/dashboard/InteractivePreview';
import { LifecycleDiagram } from '../../components/dashboard/LifecycleDiagram';
import { VideoExplainer } from '../../components/dashboard/VideoExplainer';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  Layers, 
  FileSpreadsheet, 
  RefreshCcw, 
  AlertCircle,
  Building,
  Award,
  Sparkles,
  BarChart3,
  Search,
  FileCheck2,
  Users2,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F5F7FB] to-[#F5F7FB]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-br from-blue-400/10 via-teal-400/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>SMART INDIA HACKATHON 2026 · PS SIH26265</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#101C35] tracking-tight leading-[1.12]">
                Every Deposit <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Accounted For.</span>
                <br />
                Every Deadline Under Control.
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage security deposits, FDRs, and Bank Guarantees through one transparent workflow—from registration and 5-point verification to maturity alerts, renewals, and authorized refunds.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-98"
                >
                  <span>Explore Live Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/workflow"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-2xs transition-colors"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Project Metadata Ribbon */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Theme: <strong className="text-slate-800">Smart Automation</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Team: <strong className="text-slate-800">Sanjievani</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Category: <strong className="text-slate-800">Software Fintech</strong></span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Preview */}
            <div className="lg:col-span-6 relative">
              <InteractivePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section: Financial Instruments Deserve Better Than Spreadsheets */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">The Institutional Challenge</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C35] tracking-tight">
              Financial Instruments Deserve Better Than Spreadsheets.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Public procurement departments handle thousands of physical Fixed Deposit Receipts, Earnest Money Deposits, and Bank Guarantees. Without a specialized platform, catastrophic blind spots emerge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: AlertCircle,
                title: 'Scattered & Lost Physical Receipts',
                color: 'text-rose-600 bg-rose-50',
                desc: 'Original deposit certificates stored in physical almirahs and local drawers with zero central index, making audits time-consuming.',
              },
              {
                icon: Calendar,
                title: 'Missed Maturity Dates',
                color: 'text-amber-600 bg-amber-50',
                desc: 'Without automated calendar reminders, instruments expire without renewal or encashment notice, causing potential revenue loss.',
              },
              {
                icon: RefreshCcw,
                title: 'Endless Manual Follow-Ups',
                color: 'text-blue-600 bg-blue-50',
                desc: 'Officers spend weeks sending manual emails and calling bank branches to check lien status and verification codes.',
              },
              {
                icon: Users2,
                title: 'Unclear Role Responsibility',
                color: 'text-purple-600 bg-purple-50',
                desc: 'Lack of segregated workflows leads to confusion between tender officers, accounts reviewers, and sanctioning authorities.',
              },
              {
                icon: Lock,
                title: 'Fragmented Audit Trails',
                color: 'text-teal-600 bg-teal-50',
                desc: 'Paper notes and offline signoffs leave no tamper-proof cryptographic logs for statutory audit compliance under CAG rules.',
              },
              {
                icon: BarChart3,
                title: 'Slow, Inaccurate Reporting',
                color: 'text-indigo-600 bg-indigo-50',
                desc: 'Compiling institution-wise and bank-wise contingent liability reports takes weeks of manual spreadsheet aggregation.',
              },
            ].map((prob, i) => {
              const Icon = prob.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all bg-[#F8FAFC]"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-4 ${prob.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2">{prob.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{prob.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Section: One Workflow. Complete Visibility. */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The SECUREFLOW Solution</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C35] tracking-tight">
              One Workflow. Complete Visibility.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Engineered strictly in accordance with Department of Expenditure manuals to bring institutional precision and speed to deposit governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '1. Centralized Instrument Registry',
                desc: 'Single searchable index for every FDR, Bank Guarantee, and EMD across all regional departments and tender packages.',
                link: '/dashboard/instruments',
              },
              {
                title: '2. Intelligent Validation Engine',
                desc: 'Instant duplicate reference detection, IFSC branch verification, and tender timeline reconciliation before submission.',
                link: '/dashboard/instruments/new',
              },
              {
                title: '3. Role-Segregated Approvals',
                desc: 'Multi-tiered clearance from verification officers to finance directors. No user can authorize their own submission.',
                link: '/dashboard/approvals',
              },
              {
                title: '4. Dynamic Maturity Calendar',
                desc: 'Automatic 60, 30, 15, and 7-day milestone notifications to avoid expired instruments without renewal.',
                link: '/dashboard/maturity',
              },
              {
                title: '5. Renewal & Release Lifecycle',
                desc: 'Extension requests and final refund claims preserve historical instrument data without overwriting original dates.',
                link: '/dashboard/renewals',
              },
              {
                title: '6. Immutable Audit Trail & Reports',
                desc: 'Timestamped actor logs, bank-wise summaries, and 1-click CSV/Print reports aligned with DoE 2024/2025 procurement standards.',
                link: '/dashboard/reports',
              },
            ].map((sol, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2">{sol.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sol.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link
                    to={sol.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>View Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Lifecycle Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LifecycleDiagram />
        </div>
      </section>

      {/* Visual Explainer Motion Simulator Section */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Visual Walkthrough</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C35] tracking-tight">
              Interactive Product Explainer
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Watch how SECUREFLOW tracks an instrument through all six life stages in real time.
            </p>
          </div>

          <VideoExplainer />
        </div>
      </section>

      {/* Impact & Comparative Analysis Section (From PPT Slide 5) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Measurable Impact</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C35] tracking-tight">
              Transforming Manual Friction Into Automated Control
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Direct comparison between existing legacy paper practices and the SECUREFLOW digital platform.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#101C35] text-white">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Feature</th>
                    <th className="py-3.5 px-4 font-bold text-rose-300">Manual Process</th>
                    <th className="py-3.5 px-4 font-bold text-teal-300">SECUREFLOW Portal</th>
                    <th className="py-3.5 px-4 font-bold">Direct Benefit</th>
                    <th className="py-3.5 px-4 font-bold">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-navy">Deposit Records</td>
                    <td className="py-3 px-4 text-slate-500">Scattered files & paper binders</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">Centralized digital register</td>
                    <td className="py-3 px-4 text-slate-700">Instant multi-filter search</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Zero lost documents</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-navy">Due Dates & Expiry</td>
                    <td className="py-3 px-4 text-slate-500">Manual desktop diary reminders</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">Automated 60/30/15/7d alerts</td>
                    <td className="py-3 px-4 text-slate-700">Fewer missed renewal windows</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Timely contract action</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-navy">Bank Verification</td>
                    <td className="py-3 px-4 text-slate-500">Slow email & postal follow-up</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">Tracked officer review queue</td>
                    <td className="py-3 px-4 text-slate-700">5-point checklist accountability</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Enforceable verification</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-navy">Audit Readiness</td>
                    <td className="py-3 px-4 text-slate-500">Fragmented physical dispatch registers</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">Timestamped cryptographic audit logs</td>
                    <td className="py-3 px-4 text-slate-700">Full end-to-end traceability</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Instant CAG audit export</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-navy">Financial Reports</td>
                    <td className="py-3 px-4 text-slate-500">Weeks of manual compilation</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">1-click institution & bank reports</td>
                    <td className="py-3 px-4 text-slate-700">Instant CSV & PDF export</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Complete treasury visibility</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#101C35] via-[#192A49] to-[#0C1527] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-teal-300">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Bring Every Instrument Into Focus.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience the complete SECUREFLOW operational workspace with 25 realistic financial instruments, role-based workflows, and live audit logging.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 transition-all active:scale-98"
            >
              Launch Demo Dashboard
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              View 5 Demo Accounts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
