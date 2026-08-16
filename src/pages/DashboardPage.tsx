import React, { useState, useEffect } from "react";
import { 
  Users, 
  HeartPulse, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building2,
  Stethoscope,
  ChevronRight,
  Eye
} from "lucide-react";
import { AnalysisRecord, Patient, AppSettings, Appointment } from "../types";
import { storageService } from "../services/storage";
import { DemoBadge } from "../components/common/DemoBadge";

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  settings: AppSettings;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, settings }) => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    setAnalyses(storageService.getAnalyses());
    setPatients(storageService.getPatients());
    setAppointments(storageService.getAppointments());
  }, []);

  const totalPatients = patients.length;
  const totalScans = analyses.length;
  const totalAppointments = appointments.length;

  const recentAnalyses = analyses
    .filter(a => {
      if (!searchFilter) return true;
      const q = searchFilter.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.prediction.toLowerCase().includes(q) ||
        a.patientId.toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hospital Clinical Dashboard
            </h1>
            <DemoBadge label="PORTAL ACTIVE" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
            Real-time overview of patient health registries, cranial MRI scans, and specialist consult queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/register")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1d1526] hover:bg-[#251b30] border border-rose-800/60 text-rose-200 font-bold text-xs sm:text-sm transition-colors"
          >
            <UserPlus className="w-4 h-4 text-red-400" />
            <span>Register Patient</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/analyze")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Perform Cranial Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Registered Patients */}
        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/40 shadow-xl transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80 font-mono">Enrolled Patients</span>
            <div className="p-2 rounded-2xl bg-rose-500/15 text-rose-300 border border-rose-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{totalPatients}</span>
            <span className="text-xs text-rose-300/60 font-medium">Profiles</span>
          </div>
          <p className="text-[11px] text-rose-200/60">
            Active patient records with Health ID cards
          </p>
        </div>

        {/* Card 2: Cranial Scans Processed */}
        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/40 shadow-xl transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80 font-mono">Cranial Scans</span>
            <div className="p-2 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/20">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-red-400">{totalScans}</span>
            <span className="text-xs text-rose-300/60 font-medium">Evaluated</span>
          </div>
          <p className="text-[11px] text-rose-200/60">
            Archived with focal saliency mapping
          </p>
        </div>

        {/* Card 3: Doctor Consultations */}
        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/40 shadow-xl transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80 font-mono">Specialist Visits</span>
            <div className="p-2 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{totalAppointments}</span>
            <span className="text-xs text-amber-400 font-medium font-mono">Scheduled</span>
          </div>
          <p className="text-[11px] text-rose-200/60">
            Neurology & neurosurgical consults
          </p>
        </div>

        {/* Card 4: Clinical Triage System Status */}
        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/40 shadow-xl transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80 font-mono">Clinical System</span>
            <div className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
              Ready & Online
            </span>
          </div>
          <p className="text-[11px] text-rose-200/60">
            Cranial diagnostic suite operational
          </p>
        </div>
      </div>

      {/* Quick Launch Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-red-950/50 via-[#1c121e] to-[#140c16] border border-red-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-mono font-bold">
                DIAGNOSTIC SUITE READY
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Perform Cranial MRI Diagnostic Scan
            </h3>
            <p className="text-xs sm:text-sm text-rose-200/80 max-w-md leading-relaxed">
              Upload patient scans or select verified benchmark cases to generate multi-class pathology triage and focal lesion localization heatmaps.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/analyze")}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shrink-0 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
          >
            Launch Scanner
          </button>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5 text-red-400" />
              Department Triage
            </span>
            <span className="text-[10px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
              Station 4
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-white">
              Cranial Imaging & Neurosurgical Suite
            </p>
            <p className="text-[11px] text-rose-200/70 leading-relaxed">
              Triage protocols configured for Glioma, Meningioma, Pituitary Adenoma, and physiological baseline scans.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/health-guide")}
            className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 pt-1"
          >
            <span>View Brain Health Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Diagnostic Analyses Table */}
      <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Recent Diagnostic Cranial Scans
              </h3>
              <span className="text-[11px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                CLINICAL ARCHIVES
              </span>
            </div>
            <p className="text-xs text-rose-200/70">
              Recently evaluated patient scans and regional lesion assessments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search scan, patient, finding..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs text-slate-100 placeholder-rose-300/40 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/history")}
              className="text-xs text-red-400 hover:text-red-300 font-bold shrink-0"
            >
              View All ({analyses.length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-rose-200">
            <thead className="text-[11px] uppercase tracking-wider text-rose-300/70 bg-[#120e18] border-b border-rose-900/40 font-mono">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Scan ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Diagnostic Finding</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-900/30">
              {recentAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-rose-400/60 text-xs">
                    No recent cranial scans found matching filter
                  </td>
                </tr>
              ) : (
                recentAnalyses.map((scan) => {
                  const badgeColor = 
                    scan.prediction === "Glioma" ? "text-rose-300 bg-rose-500/20 border-rose-500/40" :
                    scan.prediction === "Meningioma" ? "text-amber-300 bg-amber-500/20 border-amber-500/40" :
                    scan.prediction === "Pituitary" ? "text-cyan-300 bg-cyan-500/20 border-cyan-500/40" :
                    "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";

                  return (
                    <tr key={scan.id} className="hover:bg-rose-950/20 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        {scan.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white">{scan.patientName}</div>
                        <div className="text-[10px] text-rose-400/70 font-mono">{scan.patientId}</div>
                      </td>
                      <td className="px-4 py-3.5 text-rose-300/70 font-mono">
                        {new Date(scan.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                          {scan.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        {(scan.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{scan.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/history/${scan.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs transition-colors"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
