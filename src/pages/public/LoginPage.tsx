import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, availableUsers, switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@secureflow.demo');
  const [password, setPassword] = useState('SecureFlow@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please use one of the demo accounts.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userRole: UserRole) => {
    switchRole(userRole);
    const target = availableUsers.find(u => u.role === userRole);
    if (target) {
      setEmail(target.email);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-block mb-3">
          <Logo size="lg" withTagline />
        </div>
        <h2 className="text-2xl font-black text-navy tracking-tight">
          Institutional Access Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Smart Security Deposit & FDR Management · SIH 2026
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/90 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@institution.gov.in"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                  Access Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Secure Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant Demo Access (SIH 2026 Evaluation)
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                PWD: SecureFlow@2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-navy group-hover:text-blue-600">Administrator</p>
                  <p className="text-[10px] text-slate-500">Dr. Rajeshwar Sharma</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Enter &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('institution')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-navy group-hover:text-blue-600">Institution User</p>
                  <p className="text-[10px] text-slate-500">Priyanka Sen (NHAI)</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Enter &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('officer')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-navy group-hover:text-blue-600">Verification Officer</p>
                  <p className="text-[10px] text-slate-500">Vikramaditya Verma</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Enter &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('approver')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-navy group-hover:text-blue-600">Financial Approver</p>
                  <p className="text-[10px] text-slate-500">Meenakshi Iyer (JFC)</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Enter &rarr;
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('auditor')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-navy group-hover:text-teal-700">Read-Only Statutory Auditor</p>
                <p className="text-[10px] text-slate-500">Sunil Gokhale (Audit & Vigilance Directorate)</p>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                Audit View &rarr;
              </span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>New institutional department? </span>
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Request Institution Enrollment
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            &larr; Back to SECUREFLOW Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
