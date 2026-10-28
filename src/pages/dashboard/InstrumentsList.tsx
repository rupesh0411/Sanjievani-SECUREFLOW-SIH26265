import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  RefreshCcw
} from 'lucide-react';
import { InstrumentStatus, InstrumentType } from '../../types';

export const InstrumentsList: React.FC = () => {
  const { instruments, institutions } = useData();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState<string>('all');
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Sort state
  const [sortField, setSortField] = useState<'amount' | 'maturityDate' | 'issueDate' | 'referenceNumber'>('maturityDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Extract distinct banks for filter dropdown
  const bankOptions = useMemo(() => {
    const set = new Set<string>();
    instruments.forEach(i => set.add(i.bankName));
    return Array.from(set).sort();
  }, [instruments]);

  // Filter & Sort logic
  const filteredInstruments = useMemo(() => {
    return instruments.filter(item => {
      // Search
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || (
        item.referenceNumber.toLowerCase().includes(query) ||
        item.vendorName.toLowerCase().includes(query) ||
        item.bankName.toLowerCase().includes(query) ||
        item.institutionName.toLowerCase().includes(query) ||
        item.purpose.toLowerCase().includes(query) ||
        (item.contractRef && item.contractRef.toLowerCase().includes(query))
      );

      // Institution
      const matchesInst = selectedInst === 'all' || item.institutionId === selectedInst;

      // Bank
      const matchesBank = selectedBank === 'all' || item.bankName === selectedBank;

      // Type
      const matchesType = selectedType === 'all' || item.type === selectedType;

      // Status
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesInst && matchesBank && matchesType && matchesStatus;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'maturityDate') {
        comparison = new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
      } else if (sortField === 'issueDate') {
        comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      } else {
        comparison = a.referenceNumber.localeCompare(b.referenceNumber);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [instruments, search, selectedInst, selectedBank, selectedType, selectedStatus, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredInstruments.length / pageSize) || 1;
  const paginatedItems = filteredInstruments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Reference Number', 'Type', 'Amount (INR)', 'Issuing Bank', 'Branch IFSC', 'Institution', 'Contractor Vendor', 'Issue Date', 'Maturity Date', 'Status'];
    const rows = filteredInstruments.map(i => [
      i.id,
      `"${i.referenceNumber}"`,
      `"${i.type}"`,
      i.amount,
      `"${i.bankName}"`,
      i.ifscCode,
      `"${i.institutionName}"`,
      `"${i.vendorName}"`,
      i.issueDate,
      i.maturityDate,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SECUREFLOW_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Instrument Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master repository of Security Deposits, FDRs, and Bank Guarantees across all institutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/dashboard/instruments/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Instrument</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reference, vendor, bank, tender..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Institution Filter */}
          <div>
            <select
              value={selectedInst}
              onChange={e => {
                setSelectedInst(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.code} — {inst.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Filter */}
          <div>
            <select
              value={selectedBank}
              onChange={e => {
                setSelectedBank(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Issuing Banks</option>
              {bankOptions.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Deposit</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired / Due</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="renewed">Renewed</option>
              <option value="release_requested">Release Requested</option>
              <option value="released">Released / Refunded</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-navy">{filteredInstruments.length}</strong> matching records
          </span>

          {(search || selectedInst !== 'all' || selectedBank !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedInst('all');
                setSelectedBank('all');
                setSelectedType('all');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th 
                  className="py-3 px-4 font-bold cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort('referenceNumber')}
                >
                  <div className="flex items-center gap-1">
                    <span>Instrument / Ref</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold">Institution</th>
                <th className="py-3 px-4 font-bold">Type & Bank</th>
                <th 
                  className="py-3 px-4 font-bold cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    <span>Amount (INR)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-bold cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort('maturityDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Maturity Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Officer</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length > 0 ? (
                paginatedItems.map(inst => (
                  <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-navy font-mono">{inst.referenceNumber}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{inst.id}</span>
                      <p className="text-[11px] text-slate-600 truncate max-w-[160px]">{inst.vendorName}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <p className="font-semibold">{inst.institutionName.split('(')[0]}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{inst.department}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{inst.type.split('(')[0]}</p>
                      <p className="text-[11px] text-slate-500">{inst.bankName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-black text-navy text-xs sm:text-sm">
                        ₹{inst.amount.toLocaleString('en-IN')}
                      </p>
                      {inst.interestRate && (
                        <p className="text-[10px] text-emerald-600 font-semibold">{inst.interestRate}% p.a.</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{inst.maturityDate}</p>
                      <p className="text-[10px] text-slate-400">Issued: {inst.issueDate}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inst.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="font-medium truncate max-w-[120px]">{inst.assignedOfficerName || 'Unassigned'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/dashboard/instruments/${inst.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No matching instruments found. Adjust your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
