import React from "react";
import { 
  HeartPulse, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  Users, 
  History, 
  Activity, 
  Scan, 
  Calendar, 
  UserPlus, 
  Building2, 
  Stethoscope, 
  PhoneCall, 
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { DemoBadge } from "../components/common/DemoBadge";
import { SAMPLE_SCANS } from "../data/sampleScans";

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#180f1b] via-[#120a14] to-[#0c070e] border border-rose-900/50 p-6 sm:p-12 lg:p-16 shadow-2xl">
        {/* Ambient Medical Red Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-700/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <DemoBadge label="CLINICAL HEALTHCARE PORTAL" size="md" />
              <span className="text-xs font-mono text-rose-300 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
                Department of Neurology & Radiology
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Neuro<span className="text-red-500">Care</span> Health
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 via-rose-300 to-rose-200 bg-clip-text text-transparent">
                Cranial Diagnostic & Patient Management System
              </p>
            </div>

            <p className="text-sm sm:text-base text-rose-100/80 leading-relaxed max-w-2xl">
              An advanced healthcare platform facilitating patient registration, cranial MRI scan triage, automated focal lesion localization, and specialist clinical consultations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/analyze")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <HeartPulse className="w-5 h-5" />
                <span>Start Cranial Scan</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("/register")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1d1526] hover:bg-[#251b30] border border-rose-900/60 hover:border-rose-700 text-rose-100 font-bold text-sm sm:text-base transition-colors"
              >
                <UserPlus className="w-4 h-4 text-red-400" />
                <span>Register Patient</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("/appointments")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-200 font-bold text-sm sm:text-base transition-colors"
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Book Doctor Visit</span>
              </button>
            </div>

            {/* Quick Statistics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-rose-900/40 text-xs">
              <div>
                <span className="text-rose-400/70 block text-[11px] font-mono">Triage Classes</span>
                <span className="text-white font-extrabold">4 Primary Types</span>
              </div>
              <div>
                <span className="text-rose-400/70 block text-[11px] font-mono">Focal Saliency</span>
                <span className="text-red-300 font-extrabold">Heatmap Overlay</span>
              </div>
              <div>
                <span className="text-rose-400/70 block text-[11px] font-mono">Specialist Triage</span>
                <span className="text-white font-extrabold">Live Consultations</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Brain MRI Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-black border-2 border-rose-900/60 shadow-2xl p-3 overflow-hidden group">
              <img
                src={SAMPLE_SCANS[0].svgDataUri}
                alt="Brain MRI Showcase"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Glass Card */}
              <div className="absolute inset-x-5 bottom-5 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-rose-800/80 text-white space-y-2 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-300 uppercase flex items-center gap-1.5 font-bold">
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                    Diagnostic Evaluation
                  </span>
                  <span className="text-emerald-400 font-bold">94.0% Confidence</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base sm:text-lg text-white">Glioma Lesion</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    High Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Clinical Modules Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
            COMPREHENSIVE HEALTHCARE SUITE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Integrated Clinical Services & Diagnostic Tools
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/70">
            From emergency patient registration to advanced radiological scans and specialist bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Patient Registration */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/50 transition-all shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Patient & Staff Registration</h3>
            <p className="text-xs sm:text-sm text-rose-200/70 leading-relaxed">
              Enroll patients and clinicians with auto-generated Digital Health IDs, emergency contact profiles, blood group tracking, and printable cards.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/register")}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 pt-2"
            >
              <span>Register New Patient</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Cranial Diagnostics */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/50 transition-all shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cranial MRI Diagnostic Suite</h3>
            <p className="text-xs sm:text-sm text-rose-200/70 leading-relaxed">
              Automated image triage and multi-class assessment across Glioma, Meningioma, Pituitary Adenoma, and normal physiological cranial anatomy.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/analyze")}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 pt-2"
            >
              <span>Analyze MRI Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Doctor Consultations */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/50 transition-all shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Specialist Consultations</h3>
            <p className="text-xs sm:text-sm text-rose-200/70 leading-relaxed">
              Schedule direct hospital visits or secure telehealth video consultations with board-certified neurologists, neurosurgeons, and neuroradiologists.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/appointments")}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 pt-2"
            >
              <span>Schedule Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Assistance Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-[#1d101c] to-rose-950/60 border-2 border-red-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">24/7 Cranial Emergency Triage Hotline</h3>
            <p className="text-xs sm:text-sm text-rose-200/80">
              Immediate triage dispatch for sudden focal deficits, thunderclap headaches, or new adult seizures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:911"
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors"
          >
            Emergency: 911
          </a>
          <button
            type="button"
            onClick={() => onNavigate("/health-guide")}
            className="px-4 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs sm:text-sm"
          >
            View Warning Signs
          </button>
        </div>
      </section>
    </div>
  );
};
