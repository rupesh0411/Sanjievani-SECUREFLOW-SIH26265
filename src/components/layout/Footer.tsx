import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101C35] text-white border-t border-slate-800">
      {/* Top Banner with SIH Metadata */}
      <div className="border-b border-slate-800/80 bg-[#0C1527] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5" />
              SMART INDIA HACKATHON 2026
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium">Problem Statement: <strong className="text-white">SIH26265</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Theme: <span className="text-teal-400 font-medium">Smart Automation</span></span>
            <span className="hidden md:inline">·</span>
            <span>Team: <span className="text-white font-medium">Sanjievani</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" withTagline />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Every Deposit Accounted For. Every Deadline Under Control. SECUREFLOW centralizes the complete lifecycle of security deposits and Fixed Deposit Receipts (FDRs) for Indian public procurement.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Role-Based Access & Audit Logging</span>
              </div>
            </div>
          </div>

          {/* Public Portal Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Overview</Link></li>
              <li><Link to="/features" className="hover:text-blue-400 transition-colors">Core Features</Link></li>
              <li><Link to="/workflow" className="hover:text-blue-400 transition-colors">Instrument Lifecycle</Link></li>
              <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security & Access</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About & SIH Team</Link></li>
            </ul>
          </div>

          {/* Operational Workspaces */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-4">Operations</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Operations Dashboard</Link></li>
              <li><Link to="/dashboard/instruments" className="hover:text-blue-400 transition-colors">Instrument Registry</Link></li>
              <li><Link to="/dashboard/instruments/new" className="hover:text-blue-400 transition-colors">Register Deposit</Link></li>
              <li><Link to="/dashboard/verification" className="hover:text-blue-400 transition-colors">Verification Queue</Link></li>
              <li><Link to="/dashboard/maturity" className="hover:text-blue-400 transition-colors">Maturity Calendar</Link></li>
              <li><Link to="/dashboard/audit" className="hover:text-blue-400 transition-colors">Audit Trail</Link></li>
            </ul>
          </div>

          {/* Regulatory Citations */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-4">Regulatory Basis</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>DoE Manual for Procurement of Goods (2024)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>DoE Manual for Non-Consultancy Services (2025)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>OWASP ASVS Level 2 Verification Standards</span>
              </li>
              <li className="pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-xs">
                  <span>Demo Access Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left leading-relaxed">
            <strong className="text-slate-300">Prototype Disclaimer:</strong> SECUREFLOW is an enterprise prototype built for Smart India Hackathon 2026. Document checks represent officer verification workflows; live bank API integration is an authorized future extension.
          </p>
          <div className="flex-shrink-0 text-slate-400">
            &copy; {new Date().getFullYear()} Team Sanjievani · SIH26265
          </div>
        </div>
      </div>
    </footer>
  );
};
