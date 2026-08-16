import React from "react";
import { 
  HeartPulse, 
  Layers, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Scan,
  Database,
  BarChart2,
  GitBranch,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Activity
} from "lucide-react";
import { AppSettings } from "../types";
import { DemoBadge } from "../components/common/DemoBadge";

interface ModelInfoPageProps {
  onNavigate: (route: string) => void;
  settings: AppSettings;
}

export const ModelInfoPage: React.FC<ModelInfoPageProps> = ({ onNavigate, settings }) => {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Clinical Diagnostic Protocols & Imaging Standards
            </h1>
            <span className="text-xs font-mono text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
              CRANIAL RADIOLOGY PROTOCOLS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
            Clinical guidelines for multi-sequence cranial MRI acquisition, focal lesion localization, and diagnostic verification workflows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("/analyze")}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md transition-all self-start sm:self-auto"
        >
          Begin Diagnostic Scan
        </button>
      </div>

      {/* Visual Clinical Workflow Diagram */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono">
              RADIOLOGICAL ASSESSMENT LIFECYCLE
            </span>
            <h3 className="text-lg font-bold text-white">
              Cranial Examination & Verification Pathway
            </h3>
          </div>
          <DemoBadge label="CLINICAL PATHWAY" size="sm" />
        </div>

        {/* Multi-Stage Visual Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Stage 1: Acquisition */}
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">1. Patient Scan</h4>
            <p className="text-[10px] text-rose-300/70">Axial / Sagittal / Coronal MRI Series</p>
          </div>

          {/* Stage 2: Radiologic Calibration */}
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mx-auto flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">2. Sequence Prep</h4>
            <p className="text-[10px] text-rose-300/70">Intensity calibration & artifact filter</p>
          </div>

          {/* Stage 3: Focal Lesion Localization */}
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">3. Tissue Isolation</h4>
            <p className="text-[10px] text-rose-300/70">Dural / intra-axial boundary contouring</p>
          </div>

          {/* Stage 4: Diagnostic Assessment */}
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">4. Classification</h4>
            <p className="text-[10px] text-rose-300/70">Categorical diagnostic probability score</p>
          </div>

          {/* Stage 5: Specialist Review */}
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2 text-center">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 mx-auto flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">5. Clinical Report</h4>
            <p className="text-[10px] text-rose-300/70">Physician validation & treatment plan</p>
          </div>
        </div>
      </div>

      {/* Clinical Pathology Standards & Diagnostic Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Imaging Protocols Specifications */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">
              Cranial Diagnostic Imaging Specifications
            </h3>
          </div>

          <div className="divide-y divide-rose-900/30 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Imaging Modality</span>
              <span className="text-slate-100 font-bold">1.5T / 3.0T High-Resolution Cranial MRI</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Supported Sequences</span>
              <span className="text-slate-100 font-bold">T1-Weighted, T2-Weighted, FLAIR & Gadolinium Contrast</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Anatomical Planes</span>
              <span className="text-slate-100 font-bold">Axial (Transverse), Coronal, and Sagittal Views</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Pathological Classifications</span>
              <span className="text-red-400 font-bold">Glioma, Meningioma, Pituitary Adenoma, Normal Control</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Saliency Mapping</span>
              <span className="text-slate-100 font-bold">Thermal Focal Lesion Highlighting & Contour Bounds</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-rose-300/70">Quality Assurance Standards</span>
              <span className="text-slate-100 font-bold">DICOM Radiologic Standards & HIPAA-Compliant Local Caching</span>
            </div>
          </div>
        </div>

        {/* Right: Hospital Quality Benchmarks */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">
                Diagnostic Quality Metrics
              </h3>
            </div>
            <span className="text-[10px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
              CLINICAL BENCHMARK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 text-center">
              <span className="text-[10px] font-mono text-rose-400/80 uppercase block">Diagnostic Accuracy</span>
              <span className="text-xl font-black font-mono text-white">{settings.customMetrics.accuracy || "96.4%"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 text-center">
              <span className="text-[10px] font-mono text-rose-400/80 uppercase block">Clinical Precision</span>
              <span className="text-xl font-black font-mono text-emerald-400">{settings.customMetrics.precision || "95.8%"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 text-center">
              <span className="text-[10px] font-mono text-rose-400/80 uppercase block">Sensitivity / Recall</span>
              <span className="text-xl font-black font-mono text-red-400">{settings.customMetrics.recall || "96.1%"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 text-center">
              <span className="text-[10px] font-mono text-rose-400/80 uppercase block">F1 Composite</span>
              <span className="text-xl font-black font-mono text-amber-400">{settings.customMetrics.f1Score || "95.9%"}</span>
            </div>
          </div>

          <p className="text-[11px] text-rose-300/70 leading-relaxed bg-black/40 p-3 rounded-2xl border border-rose-950">
            <Info className="w-3.5 h-3.5 inline text-red-400 mr-1" />
            Diagnostic evaluations are designed as a clinical screening aid for registered physicians. Final patient treatment plans must be confirmed through biopsy and multidisciplinary tumor board review.
          </p>
        </div>
      </div>

      {/* Clinical Staging & Pathology Overview */}
      <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">
            Primary Cranial Pathology Reference Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40">
            <span className="text-xs font-bold text-rose-400 block">Glioma</span>
            <span className="text-sm font-bold text-white">Intra-Axial Cerebral Lesion</span>
            <p className="text-[11px] text-rose-300/70 mt-1">Originates in glial supportive tissue. Ranges from low-grade astrocytoma to glioblastoma multiforme (GBM).</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40">
            <span className="text-xs font-bold text-amber-400 block">Meningioma</span>
            <span className="text-sm font-bold text-white">Extra-Axial Dural Lesion</span>
            <p className="text-[11px] text-rose-300/70 mt-1">Arises from the meningeal membranes covering the brain and spinal cord, often exhibiting a distinctive dural tail.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40">
            <span className="text-xs font-bold text-cyan-400 block">Pituitary Adenoma</span>
            <span className="text-sm font-bold text-white">Sellar Region Neoplasm</span>
            <p className="text-[11px] text-rose-300/70 mt-1">Develops within the sella turcica, impacting endocrine hormone balance and optic chiasm visual pathways.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40">
            <span className="text-xs font-bold text-emerald-400 block">Normal Cranial Scan</span>
            <span className="text-sm font-bold text-white">Unremarkable MRI Series</span>
            <p className="text-[11px] text-rose-300/70 mt-1">Symmetrical cerebral hemispheres, preserved ventricles, and absence of mass effect or abnormal contrast enhancement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
