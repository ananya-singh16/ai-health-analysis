import React from "react";
import { HeartPulse, Sparkles } from "lucide-react";

interface DemoBadgeProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ 
  label = "CLINICAL SYSTEM ACTIVE", 
  size = "sm",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2"
  };

  return (
    <span 
      className={`inline-flex items-center font-mono font-semibold rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-xs backdrop-blur-xs ${sizeClasses[size]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
      </span>
      <HeartPulse className="w-3 h-3 text-rose-400 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
