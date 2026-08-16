import React, { useEffect, useState } from "react";
import { 
  HeartPulse, 
  Layers, 
  Scan, 
  FileSearch, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  Activity,
  FileCheck
} from "lucide-react";
import { motion } from "motion/react";

interface ProcessingPipelineProps {
  onComplete: () => void;
  imageUrl: string;
}

interface Step {
  id: number;
  label: string;
  subtext: string;
  icon: any;
  durationMs: number;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Ingesting Cranial MRI Scan...",
    subtext: "Validating DICOM/PNG matrix dimensions and slice bit-depth",
    icon: Scan,
    durationMs: 400
  },
  {
    id: 2,
    label: "Normalizing Contrast & Skull Stripping...",
    subtext: "Applying cranial windowing and parenchymal contrast enhancement",
    icon: FileSearch,
    durationMs: 500
  },
  {
    id: 3,
    label: "Segmenting Cranial Tissue & Ventricles...",
    subtext: "Analyzing grey/white matter boundaries and midline symmetry",
    icon: Layers,
    durationMs: 550
  },
  {
    id: 4,
    label: "Focal Lesion Localization & Saliency...",
    subtext: "Mapping regions of interest and localizing intra/extra-axial hyperintensities",
    icon: HeartPulse,
    durationMs: 500
  },
  {
    id: 5,
    label: "Generating Clinical Findings Draft...",
    subtext: "Compiling diagnostic assessment and preliminary medical notes",
    icon: FileCheck,
    durationMs: 450
  }
];

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  onComplete,
  imageUrl
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(5);

  useEffect(() => {
    let current = 0;
    const totalSteps = STEPS.length;

    const runStep = () => {
      if (current >= totalSteps) {
        setProgressPercent(100);
        setTimeout(() => {
          onComplete();
        }, 300);
        return;
      }

      setCurrentStepIndex(current);
      const stepProgress = Math.round(((current + 1) / totalSteps) * 100);
      setProgressPercent(stepProgress);

      const duration = STEPS[current].durationMs;
      current++;
      setTimeout(runStep, duration);
    };

    const initialTimer = setTimeout(runStep, 200);
    return () => clearTimeout(initialTimer);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-2xl space-y-6">
      {/* Top Header & Visualizer */}
      <div className="text-center space-y-3">
        <div className="relative w-24 h-24 mx-auto">
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping opacity-50"></div>
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-red-600/30 to-rose-700/30 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl shadow-red-600/20 overflow-hidden">
            <img
              src={imageUrl}
              alt="Analyzing"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity filter blur-xs"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <HeartPulse className="w-10 h-10 text-red-400 relative z-10 animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            {STEPS[currentStepIndex]?.label || "Analyzing Cranial MRI Scan..."}
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/70 font-mono mt-1">
            {STEPS[currentStepIndex]?.subtext}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-rose-300/80">
          <span>DIAGNOSTIC PIPELINE</span>
          <span className="text-red-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#110d16] overflow-hidden p-0.5 border border-rose-950">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 shadow-sm shadow-red-600/50"
            initial={{ width: "5%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step by Step Checklist */}
      <div className="space-y-2 pt-2 border-t border-rose-900/30">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`
                flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-colors
                ${isCurrent 
                  ? "bg-red-500/10 border border-red-500/30 text-rose-100" 
                  : isDone 
                  ? "bg-[#1c1724]/80 border border-rose-900/30 text-rose-200/80"
                  : "bg-black/20 border border-transparent text-rose-400/40 opacity-60"
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg ${isCurrent ? "bg-red-500/20 text-red-400" : isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1c1724] text-rose-500/40"}`}>
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">{step.label}</p>
                  <p className="text-[11px] text-rose-300/60 truncate hidden sm:block">{step.subtext}</p>
                </div>
              </div>

              <div className="shrink-0 ml-2">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                ) : (
                  <span className="text-[10px] font-mono text-rose-500/40">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
