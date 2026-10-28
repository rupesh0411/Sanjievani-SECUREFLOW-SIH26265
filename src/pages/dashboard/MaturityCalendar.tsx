import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Eye,
  Building2
} from 'lucide-react';

export const MaturityCalendar: React.FC = () => {
  const { instruments, institutions } = useData();

  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1)); // Default to Nov 2026 for hackathon demo view
  const [viewMode, setViewMode] = useState<'month' | 'upcoming'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter instruments
  const filteredInstruments = useMemo(() => {
    return instruments.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesInst = institutionFilter === 'all' || item.institutionId === institutionFilter;
      return matchesStatus && matchesInst;
    });
  }, [instruments, statusFilter, institutionFilter]);

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map instruments to days of current month
  const monthEventsMap = useMemo(() => {
    const map = new Map<number, typeof instruments>();
    filteredInstruments.forEach(item => {
      const d = new Date(item.maturityDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(item);
      }
    });
    return map;
  }, [filteredInstruments, year, month]);

  // Upcoming sorted list
  const upcomingList = useMemo(() => {
    return [...filteredInstruments].sort((a, b) => {
      return new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
    });
  }, [filteredInstruments]);

  return (
    <div className="space-y-6">
      {/* Title & View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Maturity & Validity Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic milestone tracker triggering automated alerts at 60, 30, 15, and 7 days.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Chronological List
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Controls & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-extrabold text-navy min-w-[160px] text-center">
            {monthNames[month]} {year}
          </span>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetToToday}
            className="ml-2 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">All Maturity Statuses</option>
            <option value="expiring_soon">Expiring Soon (&lt;30d)</option>
            <option value="expired">Expired / Past Due</option>
            <option value="active">Active Long-Term</option>
            <option value="renewed">Renewed</option>
          </select>

          <select
            value={institutionFilter}
            onChange={e => setInstitutionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">All Institutions</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden p-4 sm:p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset padding */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-28 rounded-2xl bg-slate-50/40 border border-slate-100" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const events = monthEventsMap.get(day) || [];
              const isToday = day === 28 && month === 9 && year === 2026;

              return (
                <div
                  key={`day-${day}`}
                  className={`h-28 p-1.5 rounded-2xl border flex flex-col justify-between transition-colors overflow-hidden ${
                    isToday
                      ? 'border-blue-500 bg-blue-50/30'
                      : events.length > 0
                      ? 'border-slate-200 bg-white hover:bg-slate-50/80'
                      : 'border-slate-100 bg-white hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                    }`}>
                      {day}
                    </span>

                    {events.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {events.length} {events.length === 1 ? 'due' : 'dues'}
                      </span>
                    )}
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 overflow-y-auto max-h-18">
                    {events.map(ev => (
                      <Link
                        key={ev.id}
                        to={`/dashboard/instruments/${ev.id}`}
                        className={`block p-1 rounded-lg text-[10px] font-bold truncate transition-transform hover:scale-102 ${
                          ev.status === 'expired'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : ev.status === 'expiring_soon'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                        title={`${ev.referenceNumber} - ₹${ev.amount.toLocaleString('en-IN')} (${ev.vendorName})`}
                      >
                        {ev.referenceNumber} (₹{(ev.amount / 10000000).toFixed(1)}Cr)
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UPCOMING CHRONOLOGICAL LIST VIEW */}
      {viewMode === 'upcoming' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-3">
            Chronological Maturity Pipeline ({upcomingList.length} Instruments)
          </h2>

          <div className="space-y-3">
            {upcomingList.map(inst => (
              <div
                key={inst.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    inst.status === 'expired'
                      ? 'bg-rose-50 text-rose-700'
                      : inst.status === 'expiring_soon'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <CalendarIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-navy text-sm font-mono">{inst.referenceNumber}</p>
                      <StatusBadge status={inst.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {inst.vendorName} · {inst.bankName} · {inst.institutionName.split('(')[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="font-black text-navy text-sm sm:text-base">
                      ₹{inst.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] font-semibold text-rose-700">
                      Matures: {inst.maturityDate}
                    </p>
                  </div>

                  <Link
                    to={`/dashboard/instruments/${inst.id}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
