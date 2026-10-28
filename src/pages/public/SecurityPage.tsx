import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  History, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const securityPillars = [
    {
      icon: Key,
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Enforces strict organizational hierarchies across 5 dedicated personas: System Administrators, Institution Tenderers, Verification Officers, Financial Approvers, and Read-Only Statutory Auditors.',
      details: [
        'Principle of Least Privilege: Users only access data relevant to their institutional department.',
        'Strict Segregation of Duties (SoD): Approvers cannot approve instruments they registered.',
        'Auditors receive full read-only visibility without mutation rights.',
      ],
    },
    {
      icon: History,
      title: 'Cryptographic Audit Trail',
      desc: 'Immutable, timestamped event stream capturing every critical lifecycle mutation with user identity, role, target entity ID, IP address, and stated justification.',
      details: [
        'Tracks user logins, registrations, document checks, approvals, renewals, and refunds.',
        'Structured event model designed for direct export to Comptroller & Auditor General (CAG) inspectors.',
        'Append-only logging architecture to prevent retrospective alteration of records.',
      ],
    },
    {
      icon: Lock,
      title: 'Confidential Financial Document Protection',
      desc: 'Scanned FDR certificates and bank guarantee deeds are treated as restricted confidential financial assets.',
      details: [
        'SHA-256 hash checksum calculation upon upload to prevent silent document tampering.',
        'Document preview with restricted permissions and no confidential metadata in public query params.',
        'Document replacement requires structured version increment and reason logging.',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Bank Verification Boundary & Truthful Disclosure',
      desc: 'Honest distinction between internal institutional review and direct live bank network clearing.',
      details: [
        'An uploaded scan alone is NOT proof of authenticity; requires verification officer review with bank lien confirmation advice.',
        'Integrated duplicate scan engine flags re-used FDR reference numbers across all departments.',
        'Designed for future direct SFMS (Structured Financial Messaging System) / Core Banking API integration where authorized by RBI and partner banks.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            ENTERPRISE COMPLIANCE & CYBERSECURITY
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#101C35] tracking-tight">
            Security, Governance & Compliance
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Architected according to OWASP Application Security Verification Standards (ASVS v4.0.3) to safeguard public funds and guarantee absolute operational transparency.
          </p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-8 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h2 className="text-xl font-bold text-navy">
                      {p.title}
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {p.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {p.details.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prototype Integrity Notice */}
          <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-8 text-amber-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>SIH Hackathon Prototype & Regulatory Verification Disclosure</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              SECUREFLOW does not claim active, production-certified banking connectivity or formal government compliance accreditations prior to official security testing. In accordance with Smart India Hackathon guidelines, the current release provides an authentic, high-fidelity simulation of officer document verification and duplicate detection. Real-world deployment will integrate with approved RBI-regulated SFMS gateways.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
