import React from "react";
import { 
  Info, 
  HeartPulse, 
  ShieldAlert, 
  Building2, 
  BookOpen, 
  Layers, 
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  Award,
  Users,
  PhoneCall
} from "lucide-react";
import { DisclaimerBanner } from "../components/common/DisclaimerBanner";

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-rose-900/40">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            About NeuroCare Health Systems
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
          Hospital-grade cranial diagnostics, digital patient registries, and clinical neuro-oncology screening.
        </p>
      </div>

      {/* Mandatory Prominent Disclaimer */}
      <DisclaimerBanner />

      {/* Hospital Mission & Clinical Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
            CLINICAL EXCELLENCE & TRIAGE
          </span>
          <h3 className="text-lg font-bold text-white">
            Our Healthcare Mission
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
            NeuroCare Health delivers state-of-the-art cranial diagnostic workflow tools designed to assist neuroradiologists, neurologists, and oncologists in accelerating brain tumor screening, lesion localization, and patient follow-up scheduling.
          </p>
        </div>

        {/* Patient Centric Care */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
            INTEGRATED HEALTH PLATFORM
          </span>
          <h3 className="text-lg font-bold text-white">
            Comprehensive Patient Registry
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
            From digital health card generation and longitudinal MRI history tracking to direct neurology specialist appointment scheduling, NeuroCare Health bridges hospital clinical departments with compassionate patient care.
          </p>
        </div>
      </div>

      {/* Core Clinical Pillars */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">
            Hospital System Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-white uppercase text-[11px]">Rapid Cranial Screening</h4>
            <p className="text-rose-300/70 leading-relaxed">
              Provides multi-class diagnostic evaluation across Glioma, Meningioma, Pituitary adenoma, and normal control MRI sequences in seconds.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-white uppercase text-[11px]">Focal Lesion Highlighting</h4>
            <p className="text-rose-300/70 leading-relaxed">
              Generates thermal visual saliency heatmaps highlighting regions of anatomical interest for transparent radiological confirmation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-white uppercase text-[11px]">Digital Patient Management</h4>
            <p className="text-rose-300/70 leading-relaxed">
              Instant patient enrollment, digital health ID generation, medical history archiving, and direct appointment scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency & Support Contacts */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/60 via-[#1e0e1a] to-[#120a13] border-2 border-red-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">
            Hospital Neurology Department Contact
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-rose-400/80 block">EMERGENCY STROKE & NEURO TRIAGE</span>
            <span className="text-sm font-bold text-white font-mono">1-800-NEURO-911</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-rose-400/80 block">OUTPATIENT CONSULTATION DESK</span>
            <span className="text-sm font-bold text-white font-mono">+1 (555) 234-CARE</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-rose-400/80 block">RADIOLOGY IMAGING ARCHIVES</span>
            <span className="text-sm font-bold text-white font-mono">radiology@neurocare.health</span>
          </div>
        </div>
      </div>
    </div>
  );
};
