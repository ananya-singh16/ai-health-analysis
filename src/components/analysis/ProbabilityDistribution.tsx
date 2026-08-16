import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Hash, 
  HeartPulse, 
  Sparkles,
  ShieldAlert,
  Info
} from "lucide-react";
import { ClassProbabilities, TumorClass } from "../../types";
import { DemoBadge } from "../common/DemoBadge";

interface ProbabilityDistributionProps {
  prediction: TumorClass;
  confidence: number;
  probabilities: ClassProbabilities;
  scanId: string;
  timestamp: string;
  inferenceTimeMs: number;
  modelVersion: string;
  isDemo?: boolean;
}

const CLASS_CONFIG: Record<TumorClass, { color: string; hex: string; desc: string }> = {
  "Glioma": {
    color: "text-rose-400",
    hex: "#e11d48",
    desc: "Intra-axial glial origin lesion (infiltrative astrocytoma / glioblastoma)"
  },
  "Meningioma": {
    color: "text-amber-400",
    hex: "#f59e0b",
    desc: "Extra-axial dural mass arising from arachnoid cap cells"
  },
  "Pituitary": {
    color: "text-cyan-400",
    hex: "#06b6d4",
    desc: "Sellar / suprasellar mass compressing optic chiasm"
  },
  "No Tumor": {
    color: "text-emerald-400",
    hex: "#10b981",
    desc: "Normal cranial parenchyma without focal space-occupying mass"
  }
};

export const ProbabilityDistribution: React.FC<ProbabilityDistributionProps> = ({
  prediction,
  confidence,
  probabilities,
  scanId,
  timestamp,
  inferenceTimeMs,
  modelVersion,
  isDemo = true
}) => {
  const chartData = [
    { name: "Glioma", probability: Number(((probabilities["Glioma"] || 0) * 100).toFixed(1)), hex: CLASS_CONFIG["Glioma"].hex },
    { name: "Meningioma", probability: Number(((probabilities["Meningioma"] || 0) * 100).toFixed(1)), hex: CLASS_CONFIG["Meningioma"].hex },
    { name: "Pituitary", probability: Number(((probabilities["Pituitary"] || 0) * 100).toFixed(1)), hex: CLASS_CONFIG["Pituitary"].hex },
    { name: "No Tumor", probability: Number(((probabilities["No Tumor"] || 0) * 100).toFixed(1)), hex: CLASS_CONFIG["No Tumor"].hex },
  ].sort((a, b) => b.probability - a.probability);

  const activeConfig = CLASS_CONFIG[prediction] || CLASS_CONFIG["Glioma"];

  return (
    <div className="space-y-6">
      {/* Top Main Result Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#19111e] via-[#200f1a] to-[#140b12] border-2 border-red-500/30 shadow-2xl relative overflow-hidden text-white">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full filter blur-3xl -z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 font-mono">
                <HeartPulse className="w-4 h-4" />
                Primary Diagnostic Classification
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {prediction}
              </h2>
              <span className="text-xl sm:text-2xl font-black text-red-400">
                {(confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>

            <p className="text-xs sm:text-sm text-rose-200/80 max-w-xl">
              {activeConfig.desc}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 gap-2 bg-black/40 p-3.5 rounded-2xl border border-rose-900/50 text-xs font-mono shrink-0">
            <div>
              <span className="text-[10px] text-rose-400/60 block uppercase">SCAN ID</span>
              <span className="text-slate-200 font-bold">{scanId}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-400/60 block uppercase">SCAN DURATION</span>
              <span className="text-rose-200 font-bold">{inferenceTimeMs} ms</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-rose-900/40">
              <span className="text-[10px] text-rose-400/60 block uppercase">DIAGNOSTIC SUITE</span>
              <span className="text-slate-300 font-semibold">{modelVersion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Breakdown */}
      <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Diagnostic Probability Distribution
        </h3>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tickFormatter={(v) => `${v}%`} fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={12} width={75} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1422", borderColor: "#f43f5e", borderRadius: 12 }}
                formatter={(value: any) => [`${value}%`, "Estimated Probability"]}
              />
              <Bar dataKey="probability" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hex} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
