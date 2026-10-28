import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  size = 'md',
  withTagline = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isLight = variant === 'light';

  return (
    <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg p-1 transition-transform active:scale-98">
      {/* Brand Icon: Geometric Security Shield + Document + Precision Checkmark */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#101C35] to-[#192A49] border border-blue-500/30 shadow-md group-hover:border-blue-400/60 transition-all duration-300 flex-shrink-0`}>
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          className="w-5/6 h-5/6"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield outline */}
          <path 
            d="M18 5L7 10.2V17.8C7 24.8 11.7 31.3 18 33C24.3 31.3 29 24.8 29 17.8V10.2L18 5Z" 
            stroke="#356AE6" 
            strokeWidth="2" 
            strokeLinejoin="round" 
            fill="url(#shieldGrad)"
          />
          {/* Document Fold Line */}
          <path 
            d="M13 14H23M13 18H20" 
            stroke="#68758A" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          {/* Glowing Verification Check */}
          <path 
            d="M14 21.5L17 24.5L23.5 17" 
            stroke="#20B8A5" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="shieldGrad" x1="18" y1="5" x2="18" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#192A49" />
              <stop offset="1" stopColor="#101C35" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Teal Dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#20B8A5] ring-2 ring-white dark:ring-navy-900 shadow-sm animate-pulse" />
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight font-sans ${textSizes[size]} ${isLight ? 'text-white' : 'text-[#101C35]'}`}>
            SECURE<span className="text-[#356AE6]">FLOW</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-[#356AE6] border border-blue-200">
            SIH '26
          </span>
        </div>
        {withTagline && (
          <span className={`text-[10px] font-medium tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Security Deposit & FDR Portal
          </span>
        )}
      </div>
    </Link>
  );
};
