import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false, className = "" }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-rose-300 text-xs font-medium ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
        <span>For educational/research purposes only. This tool does not replace professional medical diagnosis.</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-rose-950/30 to-transparent border border-red-500/30 p-3.5 sm:p-4 text-rose-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 border border-red-500/30">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-0.5">
            Clinical Evaluation & Educational Advisory
          </h4>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
            For educational/research purposes only. This tool does not replace professional medical diagnosis. All diagnostic neuro-imaging assessments must be reviewed and confirmed by a certified physician or board-certified neuroradiologist.
          </p>
        </div>
      </div>
    </div>
  );
};
