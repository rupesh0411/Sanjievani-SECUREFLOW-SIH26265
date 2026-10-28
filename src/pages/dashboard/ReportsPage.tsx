import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Building2, 
  Calendar, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { instruments, institutions } = useData();

  const [activeReport, setActiveReport] = useState<'register' | 'institution' | 'bank' | 'maturities'>('institution');
  const [selectedInst, setSelectedInst] = useState<string>('all');

  // Aggregated Bank-wise exposure
  const bankExposure = useMemo(() => {
    const map = new Map<string, { count: number; totalAmount: number }>();
    instruments.forEach(i => {
      const current = map.get(i.bankName) || { count: 0, totalAmount: 0 };
      map.set(i.bankName, {
        count: current.count + 1,
        totalAmount: current.totalAmount + i.amount,
      });
    });

    return Array.from(map.entries()).map(([bank, data]) => ({
      bank,
      count: data.count,
      amountCr: Number((data.totalAmount / 10000000).toFixed(2)),
      amountRaw: data.totalAmount,
    })).sort((a, b) => b.amountRaw - a.amountRaw);
  }, [instruments]);

  // Aggregated Institution-wise exposure
  const instExposure = useMemo(() => {
    return institutions.map(inst => {
      const instInstruments = instruments.filter(i => i.institutionId === inst.id);
      const totalPledged = instInstruments.reduce((sum, item) => sum + item.amount, 0);
      const active = instInstruments.filter(i => i.status === 'active' || i.status === 'renewed').length;
      return {
        id: inst.id,
        code: inst.code,
        name: inst.name,
        count: instInstruments.length,
        activeCount: active,
        amountCr: Number((totalPledged / 10000000).toFixed(2)),
        amountRaw: totalPledged,
      };
    }).sort((a, b) => b.amountRaw - a.amountRaw);
  }, [institutions, instruments]);

  // Total Portfolio Metrics
  const totalAmountPledged = instruments.reduce((sum, i) => sum + i.amount, 0);

  // CSV Export for current report
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = `SECUREFLOW_Report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeReport === 'institution') {
      headers = ['Institution Code', 'Institution Name', 'Instruments Count', 'Active Deposits', 'Total Value (INR)', 'Total Value (Cr)'];
      rows = instExposure.map(i => [i.code, `"${i.name}"`, i.count, i.activeCount, i.amountRaw, i.amountCr]);
    } else if (activeReport === 'bank') {
      headers = ['Bank Name', 'Deposit Count', 'Total Exposure (INR)', 'Total Exposure (Cr)'];
      rows = bankExposure.map(b => [`"${b.bank}"`, b.count, b.amountRaw, b.amountCr]);
    } else {
      headers = ['Record ID', 'Reference Number', 'Institution', 'Bank', 'Amount (INR)', 'Maturity Date', 'Status'];
      rows = instruments.map(i => [i.id, `"${i.referenceNumber}"`, `"${i.institutionName}"`, `"${i.bankName}"`, i.amount, i.maturityDate, i.status]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Financial Analytics & Regulatory Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with General Financial Rules (GFR 2017) and Department of Expenditure Manuals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Portfolio Value</span>
          <p className="text-xl sm:text-2xl font-black text-blue-600">
            ₹{(totalAmountPledged / 10000000).toFixed(2)} Cr
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Across 25 Registered Instruments</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Participating Entities</span>
          <p className="text-xl sm:text-2xl font-black text-navy">{institutions.length} Institutions</p>
          <span className="text-[10px] text-slate-500 font-medium">NHAI, AIIMS, Railways, BPCL, IITD, MCGM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Issuing Banks</span>
          <p className="text-xl sm:text-2xl font-black text-teal-600">{bankExposure.length} Scheduled Banks</p>
          <span className="text-[10px] text-slate-500 font-medium">SBI, HDFC, ICICI, PNB, BOB, Canara</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Deposit Rate</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            {((instruments.filter(i => i.status === 'active' || i.status === 'renewed').length / instruments.length) * 100).toFixed(0)}%
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">High Compliance Rate</span>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-card overflow-x-auto no-print">
        {[
          { key: 'institution', label: 'Institution-wise Contingent Liability' },
          { key: 'bank', label: 'Bank-wise Exposure Distribution' },
          { key: 'register', label: 'Complete Deposit Register' },
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveReport(t.key as any)}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* REPORT 1: INSTITUTION SUMMARY */}
      {activeReport === 'institution' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy">Institution Liability Distribution (₹ Crores)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instExposure} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="code" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    formatter={(val: any) => [`₹${val} Cr`, 'Pledged Amount']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="amountCr" fill="#356AE6" radius={[6, 6, 0, 0]} name="Pledged (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101C35] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Code</th>
                  <th className="py-3 px-4 font-bold">Institution Full Name</th>
                  <th className="py-3 px-4 font-bold">Total Instruments</th>
                  <th className="py-3 px-4 font-bold">Active Instruments</th>
                  <th className="py-3 px-4 font-bold text-right">Pledged Amount (INR)</th>
                  <th className="py-3 px-4 font-bold text-right">Value (₹ Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instExposure.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">{item.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.count}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{item.activeCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      ₹{item.amountRaw.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-blue-600">
                      ₹{item.amountCr} Cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: BANK EXPOSURE */}
      {activeReport === 'bank' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy">Bank-wise Guarantee & Deposit Exposure (₹ Crores)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bankExposure} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="bank" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    formatter={(val: any) => [`₹${val} Cr`, 'Exposure']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="amountCr" fill="#20B8A5" radius={[6, 6, 0, 0]} name="Exposure (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101C35] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Issuing Bank Name</th>
                  <th className="py-3 px-4 font-bold">Instruments Held</th>
                  <th className="py-3 px-4 font-bold text-right">Total Exposure Value (INR)</th>
                  <th className="py-3 px-4 font-bold text-right">Value (₹ Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankExposure.map(b => (
                  <tr key={b.bank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-navy">{b.bank}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.count} Instruments</td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      ₹{b.amountRaw.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-teal-700">
                      ₹{b.amountCr} Cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: COMPLETE REGISTER */}
      {activeReport === 'register' && (
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101C35] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Record ID</th>
                  <th className="py-3 px-4 font-bold">Reference Number</th>
                  <th className="py-3 px-4 font-bold">Institution</th>
                  <th className="py-3 px-4 font-bold">Bank & Type</th>
                  <th className="py-3 px-4 font-bold">Amount (INR)</th>
                  <th className="py-3 px-4 font-bold">Maturity Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instruments.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-navy">{i.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{i.referenceNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{i.institutionName.split('(')[0]}</td>
                    <td className="py-3 px-4 text-slate-600">{i.bankName} ({i.type.split('(')[0]})</td>
                    <td className="py-3 px-4 font-black text-navy">₹{i.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{i.maturityDate}</td>
                    <td className="py-3 px-4 capitalize font-semibold">{i.status.replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
