import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  Award, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Lightbulb, 
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            SMART INDIA HACKATHON 2026
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#101C35] tracking-tight">
            About SECUREFLOW & Team Sanjievani
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engineered by Team Sanjievani for Problem Statement SIH26265 under the Smart Automation theme.
          </p>
        </div>
      </section>

      {/* Hackathon Specifications & Feasibility */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Statement ID</span>
              <p className="text-xl font-black text-navy mt-1">SIH26265</p>
              <p className="text-xs text-slate-500 mt-1">Streamline of Security Deposit / FDR Portal</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hackathon Theme</span>
              <p className="text-xl font-black text-blue-600 mt-1">Smart Automation</p>
              <p className="text-xs text-slate-500 mt-1">Workflow Optimization & Governance</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Team Name</span>
              <p className="text-xl font-black text-teal-600 mt-1">Sanjievani</p>
              <p className="text-xs text-slate-500 mt-1">Full-Stack Fintech Engineering</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category</span>
              <p className="text-xl font-black text-purple-600 mt-1">Software</p>
              <p className="text-xs text-slate-500 mt-1">Multi-page Enterprise Web Portal</p>
            </div>
          </div>

          {/* Feasibility & Viability Pillars (From PPT Slide 4) */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-card p-8 lg:p-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Viability Assessment</span>
              <h2 className="text-2xl font-bold text-navy mt-1">Feasibility & Implementation Pillars</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                From technical readiness to economic and legal sustainability as presented to the hackathon evaluation jury.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-navy">Technical Feasibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standard web technologies support forms, dashboards, and role-based workflows without requiring live bank integration for initial piloting.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-navy">Operational Feasibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Familiar role-based views eliminate repetitive calls and manual emails. Designated verification officers retain final approval discretion.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-navy">Economic Feasibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open-source architecture drastically reduces licensing costs. Reuses existing institutional computer terminals and department processes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3 className="text-sm font-bold text-navy">Legal & Ethical</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Role-based access protects sensitive financial records. Timestamped audit logging complies with statutory record retention directives.
                </p>
              </div>
            </div>
          </div>

          {/* Research & Policy References (From PPT Slide 6) */}
          <div className="rounded-3xl bg-[#101C35] text-white p-8 lg:p-10 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Grounded in Law & Regulations</span>
              <h2 className="text-2xl font-bold mt-1">Research & Policy References</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                SECUREFLOW is engineered directly on top of statutory procurement frameworks issued by the Ministry of Finance, Government of India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Policy & Problem References</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>Smart India Hackathon 2026 – Problem Statement SIH26265: "Streamline of Security Deposit / FDR Portal".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>Government of India, Department of Expenditure – Manual for Procurement of Goods (2024).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>Government of India, Department of Expenditure – Manual for Procurement of Non-Consultancy Services (2025).</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Technology & Security Standards</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>OWASP Application Security Verification Standard (ASVS v4.0.3) Level 2.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>React.js enterprise frontend architecture & state reactivity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">&bull;</span>
                    <span>PostgreSQL relational schema design with foreign key constraints & decimal-safe amounts.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Future Scope Ribbon */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-teal-900/40 border border-blue-500/30 text-xs text-slate-200">
              <span className="font-bold text-white uppercase tracking-wider block mb-1">
                Future Authorized Scope:
              </span>
              Direct SFMS bank integration, Aadhaar/eSign integration for digital verification certificates, and native GeM (Government e-Marketplace) and PFMS financial integration.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
