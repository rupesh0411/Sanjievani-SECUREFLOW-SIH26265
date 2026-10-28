import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  RefreshCw, 
  History,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

export const VideoExplainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const stages = [
    {
      title: '1. Fast Instrument Registration',
      subtitle: 'Capturing details & automatic duplicate scan',
      duration: 6,
      icon: FileText,
      badge: 'Step 01 / 06',
      color: 'from-blue-600 to-indigo-700',
      description: 'Institutional users enter FDR/BG parameters with instant IFSC cross-referencing and background duplicate reference scanning.',
    },
    {
      title: '2. Physical & Digital Document Verification',
      subtitle: '5-point statutory checklist verification',
      duration: 6,
      icon: ShieldCheck,
      badge: 'Step 02 / 06',
      color: 'from-indigo-600 to-purple-700',
      description: 'Verification officers inspect scanned receipts, verify bank liens, validate branch stamps, and complete the signed digital audit checklist.',
    },
    {
      title: '3. Financial Controller Approval Desk',
      subtitle: 'Role-segregated signoffs & tender sanctioning',
      duration: 6,
      icon: CheckCircle2,
      badge: 'Step 03 / 06',
      color: 'from-purple-600 to-teal-700',
      description: 'Sanctioning authorities approve deposit pledges for active contract performance. Strict segregation prevents self-approval.',
    },
    {
      title: '4. Automated Maturity Alerts & Escapes',
      subtitle: '60, 30, 15, and 7-day multi-channel alerts',
      duration: 6,
      icon: Calendar,
      badge: 'Step 04 / 06',
      color: 'from-amber-600 to-orange-700',
      description: 'Dynamic date engines monitor upcoming expirations, pushing automated in-portal notifications and escalation notices to contracting officers.',
    },
    {
      title: '5. Seamless Renewal & Release Settlement',
      subtitle: 'Preserving full historical lineage',
      duration: 6,
      icon: RefreshCw,
      badge: 'Step 05 / 06',
      color: 'from-teal-600 to-emerald-700',
      description: 'Upon contract completion, release claims trigger refund records without erasing original tenure history, preventing premature lien release.',
    },
    {
      title: '6. Cryptographic Audit Trail & Governance',
      subtitle: 'Immutable timeline for statutory auditors',
      duration: 6,
      icon: History,
      badge: 'Step 06 / 06',
      color: 'from-slate-700 to-navy-900',
      description: 'Every login, upload, checklist check, approval, and refund logs an immutable timestamped event with IP tracking for CAG compliance.',
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStage(curr => (curr + 1) % stages.length);
          return 0;
        }
        return prev + 2.5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const activeStageData = stages[currentStage];
  const Icon = activeStageData.icon;

  return (
    <div className="rounded-3xl bg-[#101C35] text-white overflow-hidden border border-slate-800 shadow-2xl">
      {/* Video Player Display Container */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#0C1527] to-[#192A49] flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        {/* Subtle Background Circuit Lines */}
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Controls */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="font-bold tracking-wider uppercase text-slate-300">SECUREFLOW Visual Explainer</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
              {activeStageData.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isMuted ? 'Simulated Audio Muted' : 'Audio On'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Animated Stage Presentation */}
        <div className="relative z-10 my-auto text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600/30 to-teal-500/20 border border-blue-400/30 shadow-glow-blue animate-bounce">
            <Icon className="w-10 h-10 text-teal-300" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeStageData.title}
            </h3>
            <p className="text-xs sm:text-sm text-teal-300 font-medium mt-1">
              {activeStageData.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {activeStageData.description}
          </p>
        </div>

        {/* Bottom Playback Controls & Scrubber */}
        <div className="relative z-10 space-y-3 pt-4">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-400 h-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setProgress(0);
                  setCurrentStage(0);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Restart Explainer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="font-mono text-slate-300">
                0{currentStage + 1} / 06
              </span>
            </div>

            {/* Stage Selector Dots */}
            <div className="flex items-center gap-1.5">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentStage(idx);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStage ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
