import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  FileText,
  Building2,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const InteractivePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'maturities' | 'verification'>('registry');

  // Sample realistic items for live interactive hero widget
  const previewInstruments = [
    {
      id: 'SEC-2026-FDR-001',
      ref: 'SBI-FDR-9920148',
      type: 'FDR',
      amount: '₹2,50,00,000',
      bank: 'State Bank of India',
      vendor: 'L&T Infrastructure Ltd',
      status: 'expiring_soon',
      days: 18,
      date: '15 Nov 2026',
    },
    {
      id: 'SEC-2026-BG-002',
      ref: 'HDFC-BG-2025-4410',
      type: 'Bank Guarantee',
      amount: '₹1,50,00,000',
      bank: 'HDFC Bank',
      vendor: 'Afcons Infrastructure',
      status: 'expiring_soon',
      days: 13,
      date: '10 Nov 2026',
    },
    {
      id: 'SEC-2026-FDR-003',
      ref: 'ICICI-FDR-7788102',
      type: 'FDR',
      amount: '₹4,50,00,000',
      bank: 'ICICI Bank',
      vendor: 'Siemens Healthcare',
      status: 'active',
      days: 295,
      date: '20 Aug 2027',
    },
    {
      id: 'SEC-2026-FDR-006',
      ref: 'CAN-FDR-5544210',
      type: 'FDR',
      amount: '₹1,20,00,000',
      bank: 'Canara Bank',
      vendor: 'IDEMIA Identity',
      status: 'pending_verification',
      days: 712,
      date: '10 Oct 2028',
    },
  ];

  return (
    <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden">
      {/* Chrome Window Header */}
      <div className="px-4 py-3 bg-[#101C35] text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 text-xs font-mono text-slate-400">secureflow.gov.in/dashboard</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Demo
          </span>
        </div>
      </div>

      {/* Hero Mini Metrics */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/70 p-3">
        <div className="px-3 py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Value</span>
          <p className="text-sm sm:text-base font-extrabold text-[#101C35]">₹51.25 Cr</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> 25 instruments
          </span>
        </div>

        <div className="px-3 py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Maturity Alert</span>
          <p className="text-sm sm:text-base font-extrabold text-amber-600">4 Instruments</p>
          <span className="text-[10px] text-amber-700 font-medium">Due in &lt;30 days</span>
        </div>

        <div className="px-3 py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verification</span>
          <p className="text-sm sm:text-base font-extrabold text-blue-600">3 Pending</p>
          <span className="text-[10px] text-blue-700 font-medium">Awaiting checklist</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center px-4 pt-2.5 border-b border-slate-100 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('registry')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'registry'
              ? 'text-blue-600 border-blue-600 bg-blue-50/40'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Live Registry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('maturities')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'maturities'
              ? 'text-blue-600 border-blue-600 bg-blue-50/40'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Maturity Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'verification'
              ? 'text-blue-600 border-blue-600 bg-blue-50/40'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Officer Queue
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 min-h-[220px]">
        {activeTab === 'registry' && (
          <div className="space-y-2">
            {previewInstruments.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                    {item.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#101C35]">{item.ref}</span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.vendor} · {item.bank}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-navy text-xs sm:text-sm">{item.amount}</p>
                  <p className="text-[10px] text-slate-400">Due {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'maturities' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Next Critical Maturity: 15 November 2026</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-1">
                L&T Infrastructure SBI FDR (₹2,50,00,000) expires in 18 days. Notice sent to National Highways Authority cell.
              </p>
            </div>

            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 py-1 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-white" />
                <p className="font-bold text-navy">10 Nov 2026 · HDFC Bank BG (₹1.50 Cr)</p>
                <p className="text-[11px] text-slate-500">Afcons Infra · Bridge Reconstruction Km 42</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-white" />
                <p className="font-bold text-navy">15 Nov 2026 · SBI FDR (₹2.50 Cr)</p>
                <p className="text-[11px] text-slate-500">L&T Expressway Corridor Pkg-4</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <p className="font-bold text-navy">20 Nov 2026 · HDFC FDR (₹98 Lakh)</p>
                <p className="text-[11px] text-slate-500">Jindal Saw · BMC Water Pipe Security</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900">Verification Checklist Review</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">5-Point Verification</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Physical FDR Scan & Stamp Integrity Check: Verified</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>IFSC Code & Bank Branch Cross-Match: Verified</span>
                </li>
                <li className="flex items-center gap-1.5 text-amber-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tender Lien Pledge Notice Endorsement: Pending Review</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-navy">Assigned Officer: Vikramaditya Verma</p>
                <p className="text-[10px] text-slate-500">Senior Verification Officer · Treasury Cell</p>
              </div>
              <Link
                to="/dashboard/verification"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
              >
                <span>Open Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">Integrated with Department of Expenditure guidelines</span>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>Open Full Dashboard</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
